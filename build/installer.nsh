!macro customInstall
  DetailPrint "Register conrabopto URI Handler"
  DeleteRegKey HKCU "SOFTWARE\Classes\conrabopto"
  WriteRegStr HKCU "SOFTWARE\Classes\conrabopto" "" "URL:conrabopto"
  WriteRegStr HKCU "SOFTWARE\Classes\conrabopto" "URL Protocol" ""
  WriteRegStr HKCU "SOFTWARE\Classes\conrabopto\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCU "SOFTWARE\Classes\conrabopto\shell" "" ""
  WriteRegStr HKCU "SOFTWARE\Classes\conrabopto\shell\Open" "" ""
  WriteRegStr HKCU "SOFTWARE\Classes\conrabopto\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend