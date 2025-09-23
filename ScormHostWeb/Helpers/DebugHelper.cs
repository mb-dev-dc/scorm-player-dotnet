namespace ScormHostWeb.Helpers
{
    public static class DebugHelper
    {
        public static bool IsDebugMode
        {
            get
            {
#if DEBUG
                return true;
#else
            return false;
#endif
            }
        }
    }
}
