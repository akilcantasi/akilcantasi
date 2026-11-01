import { describe, expect, it } from 'vitest';
import { geoUri, isApple, webDirectionsUrl } from '../src/lib/map/yol-tarifi';

const h = { lat: 39.9208, lon: 32.8541, name: 'Kızılay (toplanma alanı)' };

describe('yol tarifi bağlantıları', () => {
  it('geo: bağlantısı koordinat ve ad içerir', () => {
    expect(geoUri(h)).toBe('geo:39.920800,32.854100?q=39.920800,32.854100(' + encodeURIComponent('Kızılay  toplanma alanı') + ')');
  });
  it('iPhone Apple Haritalar, diğerleri Google Haritalar', () => {
    expect(isApple('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe(true);
    expect(webDirectionsUrl(h, 'Mozilla/5.0 (iPhone)')).toMatch(/^https:\/\/maps\.apple\.com\/\?daddr=39\.920800,32\.854100/);
    expect(webDirectionsUrl(h, 'Mozilla/5.0 (Windows NT 10.0)')).toBe('https://www.google.com/maps/dir/?api=1&destination=39.920800,32.854100');
  });
});
