$ErrorActionPreference = "Stop"

$articlesDir = "E:/DevProjects/chively-support/content/articles"

function Build-ScreenshotPlaceholder {
  param([string]$note)

  $safe = $note.Trim()
  if ([string]::IsNullOrWhiteSpace($safe)) {
    $safe = "Add a screenshot for this step."
  }

  return @(
    "<div className=""screenshot-placeholder"">",
    "  <p className=""screenshot-placeholder__title"">Screenshot Placeholder</p>",
    "  <p className=""screenshot-placeholder__note"">$safe</p>",
    "</div>"
  )
}

function Normalize-StepText {
  param([string]$text)

  $t = $text.Trim()
  $t = [regex]::Replace($t, '^\s*Step\s*\d+\s*:\s*', '', "IgnoreCase")
  $t = $t -replace [regex]::Escape([string][char]0x2013), ". "
  $t = $t -replace '\s{2,}', ' '
  $t = $t.Trim(" ", "-", ".", ";")
  if ([string]::IsNullOrWhiteSpace($t)) {
    return $null
  }

  $first = $t.Substring(0, 1).ToUpper()
  if ($t.Length -gt 1) {
    $t = $first + $t.Substring(1)
  } else {
    $t = $first
  }

  if ($t -notmatch '[\.\?\!]$') {
    $t += "."
  }

  return $t
}

$files = Get-ChildItem -Path $articlesDir -Filter "*.mdx"
$updated = 0

foreach ($file in $files) {
  $lines = Get-Content -Path $file.FullName
  $out = New-Object System.Collections.Generic.List[string]

  $inFrontmatter = $false
  $frontmatterDone = $false
  $inSteps = $false
  $lastStepText = ""

  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    if (-not $frontmatterDone -and $line -eq "---") {
      if (-not $inFrontmatter) {
        $inFrontmatter = $true
      } else {
        $inFrontmatter = $false
        $frontmatterDone = $true
      }
      $out.Add($line)
      continue
    }

    if ($line -match "^##\s+Steps\s*$") {
      $inSteps = $true
      $lastStepText = ""
      $out.Add($line)
      continue
    }

    if ($line -match "^##\s+" -and $line -notmatch "^##\s+Steps\s*$") {
      $inSteps = $false
      $out.Add($line)
      continue
    }

    # Convert standalone screenshot bracket lines into placeholder blocks.
    if ($line.Trim() -match "^\[(.+)\]$" -and $line.Trim() -notmatch "^\[!NOTE\]$") {
      $note = $matches[1]
      $placeholder = Build-ScreenshotPlaceholder -note $note
      $out.Add("")
      foreach ($pl in $placeholder) { $out.Add($pl) }
      $out.Add("")
      continue
    }

    if ($inSteps -and $line -match "^\d+\.\s+(.+)$") {
      $rawStep = $matches[1]

      # Split inline screenshot notes out of step text.
      $inlineShot = $null
      if ($rawStep -match "\[(.+)\]") {
        $inlineShot = $matches[1]
        $rawStep = [regex]::Replace($rawStep, "\s*\[(.+)\]\s*", " ", "IgnoreCase")
      }

      $step = Normalize-StepText -text $rawStep
      if ($null -ne $step -and $step -ne $lastStepText) {
        # Renumber by counting existing output steps in this section.
        $stepCount = 0
        for ($j = $out.Count - 1; $j -ge 0; $j--) {
          if ($out[$j] -match "^\d+\.\s+") { $stepCount++ } elseif ($out[$j] -match "^##\s+Steps\s*$") { break }
        }
        $nextNum = $stepCount + 1
        $out.Add("$nextNum. $step")
        $lastStepText = $step
      }

      if ($inlineShot) {
        $placeholder = Build-ScreenshotPlaceholder -note $inlineShot
        $out.Add("")
        foreach ($pl in $placeholder) { $out.Add($pl) }
        $out.Add("")
      }
      continue
    }

    $out.Add($line)
  }

  Set-Content -Path $file.FullName -Value $out -Encoding UTF8
  $updated++
}

Write-Output "Normalized $updated article files."
