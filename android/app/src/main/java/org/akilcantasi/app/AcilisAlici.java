package org.akilcantasi.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Telefon yeniden başlayınca ya da uygulama güncellenince SMS giden kutusu kaldığı yerden sürer. */
public class AcilisAlici extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent.getAction();
        if (!Intent.ACTION_BOOT_COMPLETED.equals(a) && !Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) return;
        Context ctx = context.getApplicationContext();
        if (SmsGonderici.kuyruk(ctx).acikSayisi() == 0) return;
        SmsGonderici.isle(ctx);
    }
}
