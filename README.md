Build:

- ```cordova platform add android```
- ```cordova build --release ```
- Before :
1. add ```./config.xml```
```
     <?xml version='1.0' encoding='utf-8'?>
 <widget id="com.example" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
     ...
     <platform name="android">
         <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
             <application android:networkSecurityConfig="@xml/network_security_config"/>
             <application android:usesCleartextTraffic="true" />
         </edit-config>
         <resource-file src="resources/android/xml/network_security_config.xml" target="app/src/main/res/xml/network_security_config.xml" />
      ...
 </widget>
```
2. at platform/android ... /res/android/xml/, the network_security_config.xml :
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
      <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```
- ```cordova build --release ```
