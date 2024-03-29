package com.readerapp;

import android.app.Application;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import io.amarcruz.photoview.PhotoViewPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.wonday.pdf.RCTPdfView;
import com.oblador.vectoricons.VectorIconsPackage;

import com.walmartreact.ReactOrientationListener.ReactOrientationListener;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rnfs.RNFSPackage;
import ui.fileselector.RNFileSelectorPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.eko.RNBackgroundDownloaderPackage;
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
            new SplashScreenReactPackage(),
            new ReactNativePushNotificationPackage(),
            new RNSqlite2Package(),
            new RNFetchBlobPackage(),
            new FastImageViewPackage(),
            new RCTPdfView(),
            new VectorIconsPackage(),
            new PhotoViewPackage(),
            new ReactOrientationListener(),
            new OrientationPackage(),
            new LinearGradientPackage(),
            new RNFSPackage(),
            new RNFileSelectorPackage(),
            new ReactNativeDocumentPicker(),
            new RNBackgroundDownloaderPackage()
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
