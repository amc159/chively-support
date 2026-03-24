$ErrorActionPreference = "Stop"

$articlesDir = "E:/DevProjects/chively-support/content/articles"

function Normalize-StepBody {
  param([string]$text)
  $t = $text.Trim()
  $t = $t -replace "\bII\.\s*Instruction\.?", ""
  $t = $t -replace "\bon the Chively software\b", "in Chively"
  $t = $t -replace "\bon the Chively system\b", "in Chively"
  $t = $t -replace "\s{2,}", " "
  $t = $t.Trim()
  return $t
}

function Is-WeakIntroStep {
  param([string]$stepText)
  $s = $stepText.Trim().ToLowerInvariant()
  return (
    $s.StartsWith("this page explains") -or
    $s.StartsWith("this page describes") -or
    $s.StartsWith("this page gives") -or
    $s.StartsWith("this page features")
  )
}

$files = Get-ChildItem -Path $articlesDir -Filter "*.mdx"
$changed = 0

foreach ($file in $files) {
  $lines = Get-Content -Path $file.FullName
  $out = New-Object System.Collections.Generic.List[string]

  $inSteps = $false
  $stepBuffer = New-Object System.Collections.Generic.List[object]

  function Flush-Steps {
    param(
      [System.Collections.Generic.List[object]]$buffer,
      [System.Collections.Generic.List[string]]$target
    )
    if ($buffer.Count -eq 0) { return }

    $seen = @{}
    $num = 1
    foreach ($item in $buffer) {
      if ($item.Type -eq "step") {
        $text = Normalize-StepBody $item.Text
        if ([string]::IsNullOrWhiteSpace($text)) { continue }
        if (Is-WeakIntroStep $text) { continue }

        $key = $text.ToLowerInvariant()
        if ($seen.ContainsKey($key)) { continue }
        $seen[$key] = $true

        if ($text -notmatch "[\.\?\!]$") { $text += "." }
        $target.Add("$num. $text")
        $num++
      } else {
        foreach ($raw in $item.Lines) {
          $target.Add($raw)
        }
      }
    }
  }

  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    if ($line -match "^##\s+Steps\s*$") {
      $inSteps = $true
      $out.Add($line)
      continue
    }

    if ($inSteps -and $line -match "^##\s+") {
      Flush-Steps -buffer $stepBuffer -target $out
      $stepBuffer.Clear()
      $inSteps = $false
      $out.Add($line)
      continue
    }

    if ($inSteps) {
      # Keep MDX callouts intact.
      if ($line -match "^>\s") {
        $stepBuffer.Add([pscustomobject]@{ Type = "block"; Lines = @($line) })
        continue
      }

      # Repair previously numbered callout lines.
      if ($line -match "^\d+\.\s+>\s+\[!NOTE\]\.?$") {
        $stepBuffer.Add([pscustomobject]@{ Type = "block"; Lines = @("> [!NOTE]") })
        continue
      }
      if ($line -match "^\d+\.\s+>\s+(.+)$") {
        $stepBuffer.Add([pscustomobject]@{ Type = "block"; Lines = @("> " + $matches[1]) })
        continue
      }

      if ($line -match "^\d+\.\s+(.+)$") {
        $stepBuffer.Add([pscustomobject]@{ Type = "step"; Text = $matches[1] })
        continue
      }

      # Preserve screenshot placeholder blocks and spacing within Steps section.
      if ($line -match "^<div className=""screenshot-placeholder"">") {
        $block = New-Object System.Collections.Generic.List[string]
        $block.Add($line)
        $k = $i + 1
        while ($k -lt $lines.Count) {
          $block.Add($lines[$k])
          if ($lines[$k] -match "^</div>$") { break }
          $k++
        }
        $stepBuffer.Add([pscustomobject]@{ Type = "block"; Lines = $block })
        $i = $k
        continue
      }

      # Keep blank lines in step region for readability.
      if ([string]::IsNullOrWhiteSpace($line)) {
        $stepBuffer.Add([pscustomobject]@{ Type = "block"; Lines = @("") })
        continue
      }

      # Preserve non-numbered instructional lines as step-like content.
      $stepBuffer.Add([pscustomobject]@{ Type = "step"; Text = $line })
      continue
    }

    # Non-step section: light wording cleanup.
    $line = $line -replace "\bon the Chively software\b", "in Chively"
    $line = $line -replace "\bon the Chively system\b", "in Chively"
    $out.Add($line)
  }

  if ($inSteps) {
    Flush-Steps -buffer $stepBuffer -target $out
    $stepBuffer.Clear()
  }

  Set-Content -Path $file.FullName -Value $out -Encoding UTF8
  $changed++
}

Write-Output "Polished $changed article files."
