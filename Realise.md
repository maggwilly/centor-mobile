

To fix de duplicated class error on build

    Install the “cordova-plugin-androidx” plugin

    cordova plugin add cordova-plugin-androidx

    Install “cordova-plugin-androidx-adapter” plugin

    cordova plugin add cordova-plugin-androidx-adapter

    Add these lines in your gradle.properties :

    android.useAndroidX=true
    android.enableJetifier=true

After this, make a build: cordova -d build android and check the result
