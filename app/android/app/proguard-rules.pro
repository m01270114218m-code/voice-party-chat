# Agora RTC
-keep class io.agora.** { *; }
-dontwarn io.agora.**

# flutter_local_notifications / GSON
-keep class com.google.gson.** { *; }

# Socket.io / OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Flutter deferred components
-dontwarn com.google.android.play.core.**
