Kurulum
Öncelikle bilgisayarınızda Node.js ve Visual Studio Code kurulu olduğundan emin olun.
Proje dizinine gidin: cd project-name
Bağımlılıkları yüklemek için şu komutu çalıştırın: npm install
Proje bağımlılıkları yüklendikten sonra aşağıdaki komutla projeyi başlatabilirsiniz:npm start

Genel Bilgiler
Proje giriş yap, kayıt ol, ana sayfa, borçalrım sayfalarından oluşan bir Borç Takip Uygulamasıdır.
Kullanıcı kayıt olup giriş yaptıktan sonra ana sayfada toplam borç, ödenen borç, kalan borç, bilgilerini hem yüzdelik hemde aylık grafik üzerinde görebilmektedir. Bunu yanında yaklaşan borç bilgileride sayfada listelenmektedir.
Borçlarım sayfasına gittiğinde ise bütün borçları listelenmektedir. Kullanıcı bu sayfada borç ekleme, borç düzenleme, borç silme, ödeme planı oluşturup, görüntüleme ve ve ödeme işlemlerini gerçekleştirebilmektedir.

Proje Bilgileri
Proje React.js in son sürümü ile oluşturulmuştur.
Dil olarak TypeScript
State Management olarak Redux kullanılmıştır.
Tailwind ve sass tasarım kütüphaneleri ile stillendirma yapılmıştır.

Dosyalama
src altındaki:
app dosyasında axios yapılandrıması 
components dosyasında sayfalara ait bileşenler
redux dosyasında tüm API istekleri
routes altında sayfa geçişleri ile ilgili yapılandırmalar
screens dosyasında temel sayfalar
style dosyasında stiller bulunmatadır.







