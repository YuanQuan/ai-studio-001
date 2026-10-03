$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$code = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.IO;
public class LayerCalibration {
static byte[] Read(string p, int w, int h) {
  using(var src=new Bitmap(p)) using(var im=new Bitmap(w,h,PixelFormat.Format32bppArgb)) {
    using(var g=Graphics.FromImage(im)) g.DrawImageUnscaled(src,0,0);
    if(src.Width==w-1) for(int y=0;y<h;y++) im.SetPixel(w-1,y,src.GetPixel(src.Width-1,y));
    var data=im.LockBits(new Rectangle(0,0,w,h),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
    var a=new byte[w*h*4]; Marshal.Copy(data.Scan0,a,0,a.Length); im.UnlockBits(data); return a;
  }
}
static void Save(byte[] a,string p,int w,int h) {
 using(var im=new Bitmap(w,h,PixelFormat.Format32bppArgb)) {
  var d=im.LockBits(new Rectangle(0,0,w,h),ImageLockMode.WriteOnly,PixelFormat.Format32bppArgb);
  Marshal.Copy(a,0,d.Scan0,a.Length); im.UnlockBits(d); im.Save(p,ImageFormat.Png);
 }
}
static byte Round(double x) {return (byte)Math.Max(0,Math.Min(255,Math.Round(x)));}
public static string Build(string src, string[] inputs, string folder) {
 int w=2172,h=724; Directory.CreateDirectory(folder);
 var original=Read(src,w,h); var layers=new byte[4][];
 for(int i=0;i<4;i++) layers[i]=Read(inputs[i],w,h);
 // Restore the original foreground boundary coordinates after AI extraction.
 var front=(byte[])layers[3].Clone();
 for(int y=0;y<h;y++) for(int x=0;x<w;x++) {
  int delta=(x>=940 && x<=1240 && y<600)?6:12;
  int j=(y*w+x)*4, sy=y-delta;
  for(int c=0;c<4;c++) layers[3][j+c]=sy<0?(byte)0:front[(sy*w+x)*4+c];
 }
 // Include the dark original chain strokes missed by the generated cutout.
 for(int y=544;y<587;y++) for(int x=0;x<w;x++) {
  if(x>942 && x<1238) continue;
  int j=(y*w+x)*4;
  if(original[j+2]<49 && original[j+1]<65 && original[j]<92) layers[3][j+3]=255;
 }
 var priors=new byte[4][]; for(int i=0;i<4;i++) priors[i]=(byte[])layers[i].Clone();
 var merged=new byte[w*h*4]; double error=0; int maxerror=0,changed=0;
 for(int p=0;p<w*h;p++) {
  int j=p*4; int top=0;
  for(int i=1;i<4;i++) {if(layers[i][j+3]<4) layers[i][j+3]=0; else top=i;}
  if(top==0) {for(int c=0;c<3;c++) layers[0][j+c]=original[j+c]; layers[0][j+3]=255;}
  else {
   double[] b={layers[0][j],layers[0][j+1],layers[0][j+2]};
   for(int i=1;i<top;i++) {
    double a=layers[i][j+3]/255.0;
    for(int c=0;c<3;c++) b[c]=a*layers[i][j+c]+(1-a)*b[c];
   }
   double aTop=layers[top][j+3]/255.0;
   if(aTop>.98) for(int c=0;c<3;c++) layers[top][j+c]=original[j+c];
   else {
    // Color-constrained matting: use a nearby solid subject pixel, avoiding
    // the extreme magenta/cyan colors produced by unrestricted inverse blends.
    int x=p%w,y=p/w, nearest=-1,best=99999;
    for(int dy=-9;dy<=9;dy++) for(int dx=-9;dx<=9;dx++) {
     int nx=x+dx,ny=y+dy,dist=dx*dx+dy*dy;
     if(nx<0 || nx>=w || ny<0 || ny>=h || dist>=best) continue;
     int k=(ny*w+nx)*4;
     if(priors[top][k+3]>250) {nearest=k;best=dist;}
    }
    double[] f=new double[3];
    for(int c=0;c<3;c++) f[c]=nearest>=0?original[nearest+c]:layers[top][j+c];
    bool glow=false;
    if(top==3) {
     int[] lx={1013,1161,965,1207}; int[] ly={429,429,477,477};
     for(int n=0;n<4;n++) if((x-lx[n])*(x-lx[n])+(y-ly[n])*(y-ly[n])<1100) glow=true;
    }
    if(top==2 && x>1930 && y>260 && y<365) glow=true;
    if(glow) {f[0]=30;f[1]=135;f[2]=255;}
    double numerator=0,denominator=0;
    for(int c=0;c<3;c++) {numerator+=(original[j+c]-b[c])*(f[c]-b[c]);denominator+=(f[c]-b[c])*(f[c]-b[c]);}
    double fitted=denominator>1?Math.Max(0,Math.Min(1,numerator/denominator)):aTop;
    double clean=glow?fitted:.85*fitted+.15*aTop;
    for(int c=0;c<3;c++) {
     double o=original[j+c];
     if(f[c]>o && f[c]>0) clean=Math.Min(clean,o/f[c]);
     if(f[c]<o && f[c]<255) clean=Math.Min(clean,(255-o)/(255-f[c]));
    }
    clean=Math.Min(254.0/255.0,Math.Floor(clean*255)/255.0);
    layers[top][j+3]=Round(clean*255);
    for(int c=0;c<3;c++) layers[top][j+c]=Round(f[c]);
    // Restore the backing immediately under soft edges, retaining naturally
    // colored transparent subjects rather than encoding the backdrop in them.
    int backing=top-1;
    while(backing>0 && layers[backing][j+3]<254) backing--;
    double[] targetB=new double[3];
    for(int c=0;c<3;c++) targetB[c]=(original[j+c]-clean*layers[top][j+c])/(1-clean);
    bool safe=true;
    for(int i=top-1;i>backing;i--) {
     double ai=layers[i][j+3]/255.0;
     for(int c=0;c<3;c++) targetB[c]=(targetB[c]-ai*layers[i][j+c])/(1-ai);
    }
    for(int c=0;c<3;c++) if(targetB[c]<0 || targetB[c]>255) safe=false;
    if(safe) {
     for(int c=0;c<3;c++) layers[backing][j+c]=Round(targetB[c]);
     layers[backing][j+3]=255;
    } else {
     backing=top-1;
     layers[backing][j+3]=255;
     for(int c=0;c<3;c++) layers[backing][j+c]=Round((original[j+c]-clean*layers[top][j+c])/(1-clean));
    }
    changed++;
   }
  }
  double[] outc={layers[0][j],layers[0][j+1],layers[0][j+2]};
  for(int i=1;i<4;i++) {
   double a=layers[i][j+3]/255.0;
   for(int c=0;c<3;c++) outc[c]=a*layers[i][j+c]+(1-a)*outc[c];
  }
  for(int c=0;c<3;c++) {merged[j+c]=Round(outc[c]); int e=Math.Abs(merged[j+c]-original[j+c]); error+=e; maxerror=Math.Max(maxerror,e);}
  merged[j+3]=255;
 }
 string[] names={"01_sky.png","02_mountains_buildings.png","03_ground_trees_corridor.png","04_bridge_railings_foreground.png"};
 for(int i=0;i<4;i++) Save(layers[i],Path.Combine(folder,names[i]),w,h);
 Save(merged,Path.Combine(folder,"merged_preview.png"),w,h);
 Save(original,Path.Combine(folder,"source_original.png"),w,h);
 return "Canvas: "+w+"x"+h+"; max merged RGB error: "+maxerror+"; mean absolute RGB error: "+(error/(w*h*3)).ToString("F6")+"; calibrated alpha pixels: "+changed;
}
}
'@
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
$gen = 'C:\Users\admin\.codex\generated_images\01a1020f-bbca-7511-9e49-a8475c69ebe6'
$inputs = @(
 (Join-Path $gen 'exec-94477409-2d97-4ffe-94ac-7ed6b13aa590.png'),
 (Join-Path $gen 'exec-933386cf-d4a2-473b-a3d8-e9c943399806.png'),
 (Join-Path $gen 'exec-23db4183-120a-4142-8aea-afcbf4370303.png'),
 (Join-Path $gen 'exec-c82fb659-2bf7-414a-a322-2e532ea7a749.png')
)
$result = [LayerCalibration]::Build('C:\Users\admin\AppData\Local\Temp\codex-clipboard-e01c456c-045b-490b-9888-3ad26be83b8e.png', $inputs, $PSScriptRoot)
$result | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'validation.txt') -Encoding utf8
Write-Output $result
$alphaImage = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot '04_bridge_railings_foreground.png'))
$alphaCanvas = New-Object System.Drawing.Bitmap 2172,724
$alphaGraphics = [System.Drawing.Graphics]::FromImage($alphaCanvas)
$alphaGraphics.Clear([System.Drawing.Color]::FromArgb(90,90,90))
$alphaGraphics.DrawImageUnscaled($alphaImage,0,0)
$alphaCanvas.Save((Join-Path $PSScriptRoot 'foreground_alpha_check.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$alphaGraphics.Dispose()
$alphaCanvas.Dispose()
$alphaImage.Dispose()
