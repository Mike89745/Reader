package com.readerapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.eko.RNBackgroundDownloaderPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.reactnative.photoview.PhotoViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.walmartreact.ReactOrientationListener.ReactOrientationListener;
import com.github.yamill.orientation.OrientationPackage;
import ui.fileselector.RNFileSelectorPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNBackgroundDownloaderPackage(),
            new LinearGradientPackage(),
            new RNFSPackage(),
            new ReactNativeDocumentPicker(),
            new PhotoViewPackage(),
            new VectorIconsPackage(),
            new ReactOrientationListener(),
            new OrientationPackage(),
            new RNFileSelectorPackage(),
            new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
