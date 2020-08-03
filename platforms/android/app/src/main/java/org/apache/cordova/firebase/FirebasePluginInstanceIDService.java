package org.apache.cordova.firebase;

import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;

public class FirebasePluginInstanceIDService  extends FirebaseMessagingService {

    private static final String TAG = "FirebasePlugin";


  @Override
  public void onNewToken(String token) {
    Log.d(TAG, "Refreshed token: " + token);
    FirebasePlugin.sendToken(token);
  }

}
