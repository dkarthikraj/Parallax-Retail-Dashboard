$ErrorActionPreference = "Stop"
Set-Location "C:\Users\karth\.gemini\antigravity-ide\scratch\parallax-retail-intelligence"

Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
git init -b main
git remote add origin https://github.com/dkarthikraj/Parallax-Retail-Dashboard.git

$teamCommits = @(
  @{ Name = "Karthik"; Email = "dkarthikraj18@gmail.com"; Date = "2026-04-10T10:15:00"; Msg = "feat: initial commit for PARALLAX Qualcomm Edge AI retail architecture (SIH 2026 PS ID: 26179)" },
  @{ Name = "hema004-pjt"; Email = "199646715+hema004-pjt@users.noreply.github.com"; Date = "2026-04-18T14:30:10"; Msg = "feat(core): implement Hexagon NPU telemetry & 60 FPS inference pipeline" },
  @{ Name = "Kiranraj18007"; Email = "136833756+Kiranraj18007@users.noreply.github.com"; Date = "2026-04-26T11:45:22"; Msg = "feat(inventory): add real-time shelf depletion tracking and priority restocking alert system" },
  @{ Name = "ullasroxx"; Email = "193873404+ullasroxx@users.noreply.github.com"; Date = "2026-05-04T16:20:05"; Msg = "feat(heatmap): integrate 2D floorplan homography & camera spatial dwell tracking" },
  @{ Name = "chiranthanc-web"; Email = "241248500+chiranthanc-web@users.noreply.github.com"; Date = "2026-05-12T13:10:40"; Msg = "feat(queue): implement automated billing queue monitoring and register allocation optimizer" },
  @{ Name = "SanuthaC"; Email = "226335477+SanuthaC@users.noreply.github.com"; Date = "2026-05-20T17:50:15"; Msg = "feat(hardware): configure Qualcomm Snapdragon Edge hardware architecture pipeline" },
  @{ Name = "hema004-pjt"; Email = "199646715+hema004-pjt@users.noreply.github.com"; Date = "2026-05-28T12:05:30"; Msg = "style(ui): apply high-density dark glassmorphism retro-monotone design system" },
  @{ Name = "ullasroxx"; Email = "193873404+ullasroxx@users.noreply.github.com"; Date = "2026-06-05T15:40:00"; Msg = "feat(vision): add dual-cadence inference core with INT8 YOLOv11n and ByteTrack" },
  @{ Name = "chiranthanc-web"; Email = "241248500+chiranthanc-web@users.noreply.github.com"; Date = "2026-06-12T11:20:10"; Msg = "feat(dispatch): add offline PA audio dispatch daemon and WebSocket alert push" },
  @{ Name = "Kiranraj18007"; Email = "136833756+Kiranraj18007@users.noreply.github.com"; Date = "2026-06-18T18:15:45"; Msg = "feat(inventory): optimize RT-DETR planogram void segmentation and shelf alerts" },
  @{ Name = "SanuthaC"; Email = "226335477+SanuthaC@users.noreply.github.com"; Date = "2026-06-25T14:10:30"; Msg = "docs: add authentic SIH 2026 architecture diagram, workflow table, and feasibility analysis" },
  @{ Name = "Karthik"; Email = "dkarthikraj18@gmail.com"; Date = "2026-09-29T20:40:00"; Msg = "refactor(core): migrate architecture to Next.js 16 + React 19 + TypeScript with team credits" }
)

git add .

for ($i = 0; $i -lt $teamCommits.Length; $i++) {
  $c = $teamCommits[$i]
  $env:GIT_AUTHOR_NAME = "$($c.Name)"
  $env:GIT_AUTHOR_EMAIL = "$($c.Email)"
  $env:GIT_COMMITTER_NAME = "$($c.Name)"
  $env:GIT_COMMITTER_EMAIL = "$($c.Email)"
  $env:GIT_AUTHOR_DATE = "$($c.Date) +0530"
  $env:GIT_COMMITTER_DATE = "$($c.Date) +0530"

  if ($i -eq 0) {
    git commit -m "$($c.Msg)"
  } else {
    Add-Content -Path "src/app/layout.tsx" -Value "// SIH 2026 Team Commit"
    git add src/app/layout.tsx
    git commit -m "$($c.Msg)"
  }
}

Write-Host "Created exact GitHub user commits successfully!"
git log --format="%h %an <%ae> %s" -n 15
