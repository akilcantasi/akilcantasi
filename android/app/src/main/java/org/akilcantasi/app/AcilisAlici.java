package org.akilcantasi.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Telefon yeniden başlayınca ya da uygulama güncellenince: SMS giden kutusu, enkaz modu,
 * enkaz işareti nöbeti ve sarsıntı nöbeti kaldığı yerden sürer. (Son konum kaydının
 * zamanlanmış görevlerini WorkManager kendisi korur.)
 */
public class AcilisAlici extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent.getAction();
        if (!Intent.ACTION_BOOT_COMPLETED.equals(a) && !Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) return;
        Context ctx = context.getApplicationContext();
        try {
            if (EnkazServisi.aktif(ctx)) EnkazServisi.calistir(ctx);
        } catch (Exception ignored) {}
        try {
            if (EnkazTarayici.nobetAcik(ctx)) EnkazTarayici.nobet(ctx, true);
        } catch (Exception ignored) {}
        try {
            if (SarsintiServisi.acik(ctx)) SarsintiServisi.ayarla(ctx, true);
        } catch (Exception ignored) {}
        if (SmsGonderici.kuyruk(ctx).acikSayisi() == 0) return;
        SmsGonderici.isle(ctx);
    }
}
