import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private androidPermissions: AndroidPermissions,
  ) { }

  public async checkBackgroundPermission() {
    try {
      const result = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION
      );
      if (!result || result.hasPermission === false) {
        this.requestPermissions();
      }
    } catch (error) {
      this.requestPermissions();
    }
  }

  private async requestPermissions() {
    try {
      const data = await this.androidPermissions.requestPermissions([
        'android.permission.ACCESS_BACKGROUND_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        this.androidPermissions.PERMISSION.ACTIVITY_RECOGNITION,
        this.androidPermissions.PERMISSION.FOREGROUND_SERVICE,
        this.androidPermissions.PERMISSION.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
      ]);
    } catch (error) {
      await alert('Error : ' + error);
      console.log(error);
    }
  }
}
