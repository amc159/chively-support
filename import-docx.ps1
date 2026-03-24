$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem

$downloads = "C:/Users/amcuc/Downloads"
$outDir = "E:/DevProjects/chively-support/content/articles"

function Get-DocxLines {
  param([string]$docxPath)
  $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
  try {
    $entry = $zip.GetEntry("word/document.xml")
    if (-not $entry) { return @() }
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xmlText = $reader.ReadToEnd()
    $reader.Dispose()

    [xml]$xml = $xmlText
    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
    $paras = $xml.SelectNodes("//w:p", $ns)
    $lines = @()

    foreach ($p in $paras) {
      $texts = $p.SelectNodes(".//w:t", $ns)
      if (-not $texts) { continue }
      $line = (($texts | ForEach-Object { $_.'#text' }) -join "").Trim()
      if ([string]::IsNullOrWhiteSpace($line)) { continue }
      $lines += $line
    }
    return $lines
  } finally {
    $zip.Dispose()
  }
}

function To-Slug {
  param([string]$text)
  $slug = $text.ToLowerInvariant()
  $slug = $slug -replace "&", " and "
  $slug = $slug -replace "[^a-z0-9]+", "-"
  $slug = $slug.Trim("-")
  return $slug
}

function Infer-Category {
  param([string]$title)
  $t = $title.ToLowerInvariant()
  if ($t -match "printer|kds|kitchen screen|terminal|device|android|cash drawer|secondary display|specifications") {
    return @{ Name = "Hardware & Equipment"; Slug = "hardware" }
  }
  if ($t -match "payment|refund|ebt|tip|credit card|cash discount|fees|gift card") {
    return @{ Name = "Payments & Processing"; Slug = "payments" }
  }
  if ($t -match "staff|role|timesheet|time|shift|two-factor|security code|unauthorized") {
    return @{ Name = "Staff & Permissions"; Slug = "staff" }
  }
  if ($t -match "menu|combo|orders|waitlist|layout|item|promotion|label printing|seat|table") {
    return @{ Name = "Menu & Orders"; Slug = "menu-orders" }
  }
  if ($t -match "troubleshooting") {
    return @{ Name = "Troubleshooting"; Slug = "troubleshooting" }
  }
  if ($t -match "activate|install|log in|login|management page") {
    return @{ Name = "Getting Started"; Slug = "getting-started" }
  }
  return @{ Name = "Getting Started"; Slug = "getting-started" }
}

function Parse-PublishedAt {
  param([string]$filename)
  $m = [regex]::Match($filename, "-\s+(October|November|December|January|February)\s+(\d{4})\.docx$")
  if (-not $m.Success) { return "2026-01-01T00:00:00Z" }
  $monthMap = @{ October = 10; November = 11; December = 12; January = 1; February = 2 }
  $month = $monthMap[$m.Groups[1].Value]
  $year = [int]$m.Groups[2].Value
  return (Get-Date -Year $year -Month $month -Day 1 -Hour 0 -Minute 0 -Second 0 -Format "yyyy-MM-ddTHH:mm:ssZ")
}

function Escape-Yaml {
  param([string]$text)
  if ([string]::IsNullOrWhiteSpace($text)) { return "" }
  return $text.Replace('"', '\"')
}

function Is-NoiseLine {
  param([string]$line)
  $l = $line.Trim()
  if ([string]::IsNullOrWhiteSpace($l)) { return $true }
  if ($l -match "^https?://") { return $true }
  if ($l -match "^/[A-Za-z0-9\-_\/]+$") { return $true }
  if ($l -match "^Original Link$|^URL\s*/\s*Slug$|^Meta Title$|^Meta Description") { return $true }
  if ($l -match "^\(?50-60 characters\)?$|^\(?140-160 characters\)?$") { return $true }
  if ($l -match "^Reference Pages?$|^Table of Contents|^Instructional Video$|^Objective$") { return $true }
  if ($l -match "^Page\s+\d+$|^Contents?$|^Chively$|^Updated\s+\w+\s+\d{1,2},\s+\d{4}$") { return $true }
  if ($l -match "^\[.*screenshot.*\]$|^\[insert screenshot.*\]$") { return $true }
  if ($l -match "^[IVX]+\.\s") { return $true }
  if ($l -match "^[0-9]+\.\s*$") { return $true }
  return $false
}

function Is-StepCandidate {
  param([string]$line)
  $l = $line.Trim()
  if ($l.Length -lt 18) { return $false }
  if ($l -match "^Step\s+\d+|^On the |^In the |^Go to |^Select |^Click |^Tap |^Enter |^Choose |^Open |^Enable |^Disable |^Set |^Assign |^Add |^Create |^Connect |^Install |^Verify ") { return $true }
  if ($l -match " then | and then | from the | on the | in the ") { return $true }
  return $false
}

$files = Get-ChildItem -Path $downloads -Filter "* - Chively - *.docx" | Sort-Object Name
$created = 0

foreach ($file in $files) {
  $title = ($file.BaseName -replace "\s+-\s+Chively\s+-\s+.*$", "").Trim()
  $slug = To-Slug $title
  $category = Infer-Category $title
  $publishedAt = Parse-PublishedAt $file.Name
  $rawLines = Get-DocxLines $file.FullName

  $clean = New-Object System.Collections.Generic.List[string]
  foreach ($line in $rawLines) {
    $l = $line.Trim()
    if ($l -eq $title) { continue }
    if (Is-NoiseLine $l) { continue }
    $clean.Add($l)
  }

  $description = $null
  foreach ($line in $clean) {
    if ($line.Length -lt 20) { continue }
    if ($line -match "^Step\s+\d+") { continue }
    if ($line -match "^\[.*\]$") { continue }
    $description = $line
    break
  }
  if (-not $description) { $description = "Step-by-step guide for $title in Chively." }
  if ($description.Length -gt 150) { $description = $description.Substring(0, 150).Trim() + "..." }

  $steps = New-Object System.Collections.Generic.List[string]
  foreach ($line in $clean) {
    if (-not (Is-StepCandidate $line)) { continue }
    $step = $line -replace "^[\-\*\s]+", ""
    if ($step.Length -gt 220) { $step = $step.Substring(0, 220).Trim() + "..." }
    $steps.Add($step)
    if ($steps.Count -ge 12) { break }
  }

  if ($steps.Count -eq 0) {
    $steps.Add("Open the relevant Chively screen for this workflow.")
    $steps.Add("Apply the required settings based on your store policy.")
    $steps.Add("Save changes and verify the expected behavior.")
  }

  $content = @()
  $content += "---"
  $content += "title: `"$($(Escape-Yaml $title))`""
  $content += "description: `"$($(Escape-Yaml $description))`""
  $content += "category: `"$($category.Name)`""
  $content += "categorySlug: `"$($category.Slug)`""
  $content += "tags: [`"chively`", `"guide`"]"
  $content += "publishedAt: `"$publishedAt`""
  $content += "updatedAt: `"$publishedAt`""
  $content += "---"
  $content += ""
  $content += "## Overview"
  $content += ""
  $content += "This guide covers $title in Chively using a consistent, support-friendly workflow."
  $content += ""
  $content += "## Before you begin"
  $content += ""
  $content += "- Confirm you can access the Chively Management Page or POS as needed."
  $content += "- Make sure your account has permission to change these settings."
  $content += "- Keep a test order, test payment, or test user available for validation."
  $content += ""
  $content += "## Steps"
  $content += ""
  for ($i = 0; $i -lt $steps.Count; $i++) {
    $num = $i + 1
    $content += "$num. $($steps[$i])"
  }
  $content += ""
  $content += "> [!NOTE]"
  $content += "> Add screenshots for each major step before publishing."
  $content += ""
  $content += "## Verification"
  $content += ""
  $content += "- Confirm the change is visible in the expected Chively screen."
  $content += "- Run a quick real-world test to ensure behavior is correct."
  $content += "- If results are unexpected, double-check permissions and device/network status."
  $content += ""
  $content += "## Need help?"
  $content += ""
  $content += "Contact Chively Support at **+1 (800) 439-8229** or **support@chively.com**."

  $target = Join-Path $outDir ($slug + ".mdx")
  Set-Content -Path $target -Value ($content -join "`r`n") -Encoding UTF8
  $created++
}

Write-Output "Created/updated $created article files."
