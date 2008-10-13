function Shutdown()
{
  gDialog.structurebar.shutdown();
  ResizeEventNotifier.shutdown();
  EditorScrolledNotifier.shutdown();
  BGZoomManager.shutdown();
}

