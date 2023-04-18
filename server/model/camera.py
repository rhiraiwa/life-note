import numpy as np
import os
# cv2のインポート前にカメラに関する設定を行う
os.environ["OPENCV_VIDEOIO_MSMF_ENABLE_HW_TRANSFORMS"] = "0"
import cv2
import glob
import rembg


# パス設定
DATA_DIR='client/public/receipt/temp/'
RESULT_DIR='client/public/receipt/preview/'

# 拡張子指定
ext='jpg'

# 背景除去
def doTrim(filename):
    img = cv2.imread(DATA_DIR + filename)
    output = rembg.remove(img)
    return output

# 矩形抽出メソッド
def rectangle_extraction(img, filename):
  # 2-1.グレースケール化
  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

  # 2-2.二値化
  ret, th1 = cv2.threshold(gray, 255, 255, cv2.THRESH_OTSU)

  # コピー画像？
  img_con = img.copy()

  # 矩形抽出
  contours, hierarchy = cv2.findContours(th1, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

  # 射影変換
  for i,cnt in enumerate(contours):
    areas = []
    area = cv2.contourArea(cnt)
    if area > 50000:
        ## 輪郭の近似
        epsilon = 0.08*cv2.arcLength(cnt,True)
        approx = cv2.approxPolyDP(cnt,epsilon,True)
        areas.append(approx)
    if len(areas) == 0:
        continue
    dst = get_dst(img_con, areas)
    cv2.imwrite(RESULT_DIR + filename + ".jpg".format(i), dst)

# 射影変換メソッド
def get_dst(img, areas):
    # 重心を求める
    cx=cy=0
    for i in areas[0]:
        cx += i[0][0]
        cy += i[0][1]
    cx /=len(areas[0])
    cy /=len(areas[0])

    # 切り取り画像サイズを求める
    h=w=0
    for i in areas[0]:
        if i[0][0]>cx :
            w +=i[0][0]
        else:
            w -=i[0][0]
        #右側
        if i[0][1]>cy:
            #右下
            h += i[0][1]
        else:
            #右上
            h -= i[0][1]

    # 点の順番を求める　tmp
    tmp = []
    for i in areas[0]:
        if i[0][0]>cx :
            #右側
            if i[0][1]>cy:
                #右下
                tmp.append([w,h])
            else:
                #右上
                tmp.append([w,0])
        else:
            #左側
            if i[0][1]>cy:
                #左下
                tmp.append([0,h])
            else:
                #左上
                tmp.append([0,0])
    # 射影変換
    dst = []
    pts1 = np.float32(areas[0])
    pts2 = np.float32([tmp])

    M = cv2.getPerspectiveTransform(pts1,pts2)
    dst = cv2.warpPerspective(img,M,(w,h))
    
    return dst

# メイン処理
def camera_main():
  for p in glob.glob(DATA_DIR+'*.jpg'):
    if os.path.isfile(p):
      target=os.path.basename(p)
      print(target)
      output = doTrim(target)
      rectangle_extraction(output, target.replace('.jpg', ''))

      # return DATA_DIR+target.replace('.jpg', '')
      return target

# WEBカメラ
def web(filename):
  # Webカメラ
  DEVICE_ID = 1 

  WIDTH = 1280
  HEIGHT = 960
  FPS = 5

  def decode_fourcc(v):
          v = int(v)
          return "".join([chr((v >> 8 * i) & 0xFF) for i in range(4)])
          
  cap = cv2.VideoCapture (DEVICE_ID)

  # フォーマット・解像度・FPSの設定
  # cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('M','J','P','G'))
  cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('Y','U','Y','V'))
  cap.set(cv2.CAP_PROP_FRAME_WIDTH, WIDTH)
  cap.set(cv2.CAP_PROP_FRAME_HEIGHT, HEIGHT)
  cap.set(cv2.CAP_PROP_FPS, FPS)

  # フォーマット・解像度・FPSの取得
  fourcc = decode_fourcc(cap.get(cv2.CAP_PROP_FOURCC))
  width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
  height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
  fps = cap.get(cv2.CAP_PROP_FPS)
  # print("fourcc:{} fps:{}　width:{}　height:{}".format(fourcc, fps, width, height))
  
  while True:
    # 1フレームずつ取得する。
    ret, frame = cap.read()
    #フレームが取得できなかった場合は、画面を閉じる
    if not ret:
      break
      
    # ウィンドウに出力
    cv2.imshow("Frame", frame)
    key = cv2.waitKey(1) & 0xFF
    if key == ord('c'):
      cv2.imwrite('{}{}.{}'.format(DATA_DIR, str(filename), ext), frame)
      break
    # Escキーを入力されたら画面を閉じる
    if key == 27:
      break
  cap.release()
  cv2.destroyAllWindows()
  
  print(filename)
  print(str(filename))
  print(str(filename) + '.' + ext)
  output = doTrim(str(filename) + '.' + ext)
  rectangle_extraction(output, str(filename))
  
  return