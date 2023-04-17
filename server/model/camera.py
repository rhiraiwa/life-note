import numpy as np
import cv2
import os
import glob
import rembg

# パス設定
DATA_DIR='client/public/receipt/temp/'
RESULT_DIR='client/public/receipt/preview/'

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
    cv2.imwrite(RESULT_DIR + filename + "_{}.jpg".format(i), dst)

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
      output = doTrim(target)
      rectangle_extraction(output, target.replace('.jpg', ''))

      return DATA_DIR+target.replace('.jpg', '')