package org.akilcantasi.app;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.SmsMessage;

/**
 * SMS giden kutusunun sonuç alıcısı (dışa kapalı):
 *   SMS_SENT       bir parçanın "gönderildi" sonucu (getResultCode)
 *   SMS_DELIVERED  alıcı telefonun teslim raporu (pdu durumu)
 *   SMS_TEKRAR     yeniden deneme alarmı
 */
public class SmsAlici extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Context ctx = context.getApplicationContext();
        String action = intent.getAction();
        if (action == null) return;
        SmsKuyrugu q = SmsGonderici.kuyruk(ctx);
        long now = System.currentTimeMillis();
        String id = intent.getStringExtra("id");
        int attempt = intent.getIntExtra("attempt", -1);
        switch (action) {
            case SmsGonderici.ACTION_SENT: {
                int code = getResultCode();
                String hata = code == Activity.RESULT_OK ? null : SmsKuyrugu.hataAdi(code);
                if (q.gonderimSonucu(id, attempt, hata, now)) {
                    SmsKuyrugu.Mesaj m = q.bul(id);
                    SmsGonderici.sonucBildir(ctx, m);
                    if (m != null && "bekliyor".equals(m.state) && m.nextTry <= now + 1000) SmsGonderici.isle(ctx);
                }
                SmsGonderici.planla(ctx);
                SmsGonderici.bildirimGuncelle(ctx);
                SmsGonderici.degisti();
                break;
            }
            case SmsGonderici.ACTION_DELIVERED: {
                if (q.teslimSonucu(id, attempt, teslimEdildi(intent), now)) SmsGonderici.sonucBildir(ctx, q.bul(id));
                SmsGonderici.degisti();
                break;
            }
            case SmsGonderici.ACTION_TEKRAR:
                SmsGonderici.isle(ctx);
                break;
            default:
                break;
        }
    }

    /** Teslim raporu: GSM TP-Status 0x00–0x1F tamamlandı; 0x20+ bekliyor ya da başarısız. */
    @SuppressWarnings("deprecation")
    private boolean teslimEdildi(Intent intent) {
        if (getResultCode() != Activity.RESULT_OK) return false;
        byte[] pdu = intent.getByteArrayExtra("pdu");
        if (pdu == null) return true;
        try {
            String format = intent.getStringExtra("format");
            SmsMessage sms = format != null ? SmsMessage.createFromPdu(pdu, format) : SmsMessage.createFromPdu(pdu);
            if (sms == null) return true;
            if ("3gpp2".equals(format)) return sms.getStatus() == 0 || sms.getStatus() == 2; // CDMA: ulaştı/teslim
            return sms.getStatus() < 0x20;
        } catch (Exception e) {
            return true;
        }
    }
}
