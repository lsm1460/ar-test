# ar-test

이 저장소는 저의 2024년 초 ar 실패기를 다룬다.
현 시점 web ar에서 (마커 이미지가 아닌)이미지의 트래킹 다루는 오픈소스 라이브러리에 대하여 개인적인 경험을 기록하기 위하여 남겨두려 한다.

## 1. mindAr.js

[mindAr doc](https://hiukim.github.io/mind-ar-js-doc/)  
[npm:mindAr](https://www.npmjs.com/package/mind-ar)

가장 먼저 시도한 오픈소스 라이브러리다. 문서상으로는 tensorflow를 통하여 이미지를 식별, 감지한다고 되어있지만 마커 이미지 생성을 위한 npm설치와 quick start 예제 모두 정상동작하지 않아 실패하였다.

## 2. ar.js - three.js

[ar.js doc](https://ar-js-org.github.io/AR.js-Docs/)  
[npm:ar.js](https://www.npmjs.com/package/@ar-js-org/ar.js/)  
[three.js doc](https://threejs.org/docs/)  
[npm:three.js](https://www.npmjs.com/package/three)

사실 mindAr보다 먼저 후보에 오른 라이브러리 였지만 이미지 마커 추적에 nft방식을 사용한다 하여 살짝 꺼려지는 마음이었으나 mindAr을 실패하여 이 라이브러리도 시도해보게 되었다.
처음엔 설치도 순조롭고 이미지 트래킹과 모델링 출력도 정상적으로 작동하였으며, nft마커를 서버단에서 만들 수 있어보여서 희망적이라고 생각했다.
다만 트래킹을 할 때, 살짝 버벅이고 모델링이 튀어오르는 현상이 있었다. 이것은 단지 나의 옵션 조정에 실패라고 생각한다.
하지만 서버작업을 앞두고 테스트를 진행하던 중 문제를 발견되었다.
nft가 프런트가 아닌 다른 위치(ex: 서버 측, s3 등)에 있다면 마커를 인식하지 않았고, 마커와 모델링을 서버에 올려 배포한다는 목표에 부합하지 않아 실패 사례가 되었다.

## 3. ar.js - aframe.js

[ar.js doc](https://ar-js-org.github.io/AR.js-Docs/)  
[npm:ar.js](https://www.npmjs.com/package/@ar-js-org/ar.js/)  
[aframe.js doc](aframe.io/blog/arjs3/)  
[npm:aframe.js](https://www.npmjs.com/package/aframe)

ar.js - three.js의 이미지 트레킹 문서와는 다르게 ar.js - aframe.js의 이미지 트래킹 튜토리얼에는 git에 접근하여 정적으로 건내주는 모양새로 보여 시도하게 되었다.. 만,
프런트의 퍼블릭 공간 내에 https://git..으로 시작하는 폴더를 만들어 사용한 것 이었다. 역시나 실패 사례가 되었다.
생각해보면 고유한 파일이 하나만 있다는 nft의 기조 때문에 다른 곳에서 받아오는 건 당연하게도 안될 것 같다고 다 실패하고 나서야 생각한다.
그래도 위의 three.js때보다는 이미지 트래킹과 모델링의 위치가 안정적이였다.

## 4. webXr

[webxr doc](https://immersive-web.github.io/webxr-samples/)

크롬에서 지원하는 webXr은 사파리와 호환되지 않을 뿐더러, webXr을 사용하기 위해선 크롬 익스텐션까지 설치해야 했고,
구버전 기기는 지원하지 않는 등등의 이유로 후보에서 제외하고 있었지만, 위의 3번에 실패로 안드로이드만이라도 지원할 수 있으면 해보자 라는 마음으로 시도하게 되었다.
..하지만 이미지 트래킹 기술만은 아직 실험단계로, 설치 후 안드로이드 내에서 고급 개발자 설정까지 만져야 했다.
하여 사용자 접근성이 너무 떨어진다고 판단하여 포기하게 되었다.

## 5. openCv - meanShift

[openCv](https://docs.opencv.org/4.x/index.html)  
ar관련으로 검색한 라이브러리, 내장 기능들을 모두 실패하자 이번엔 영상처리쪽으로 눈을 돌려보았다.
내가 이해한 meanShift는 내가 선택한 이미지상을 이미지변환 과정을 거쳐 강조한 뒤 의미있는 픽셀 정보를 통해 오브젝트를 트레킹하는 알고리즘이다.
이 기술을 응용하여 이미지 마커를 인지 시킨 뒤 카메라 스트림에 접근하여 유의미한 값을 도출해 내려 했으나, 실패하였다.
이뮤터블하지 않고 파라미터로 들어간 객체의 값을 조정하여 다음 단계로 넘기는 것은 디버깅도, 코드 작성도 너무 피로했다.

## 6. openCv - matchTemplate

[openCv](https://docs.opencv.org/4.x/index.html)  
솔직히 matchTemplate는 원리에 대해 설명을 들어도 잘 이해가 안된다. 무언가 내부에서 2개의 이미지를 변환 후, 유사도의 최솟값, 최대값을 뽑아내는 것 같다.
matchTemplate의 경우 카메라 스트림에서 트래킹도 실패했지만, 한번 실행 시 2~3초 가량 소비되어 적합한 알고리즘이 아니라고 판단되었다.

## 결론

솔직히 처음엔 살짝 만만하게 보고 들어온 감이 없지 않아 있는데, 실패해서 유감스럽고 추후 시간이 더 넉넉하다면 llm으로 시도해 보는 것도 좋은 공부가 될 것 같다.
차후 오픈소스 라이브러리의 동향을 더 보다가 다시 시도할 때, 오늘의 경험이 도움이 되길 바란다.
마지막으로 유료 웹 ar서비스 링크를 첨부하여 나중에 분석해볼 수 있는 시간을 갖는다면 좋을 것 같다.  
[onirix](https://www.onirix.com/learn-about-ar/image-tracking-web-ar/)  
[MyWebAR](https://mywebar.com/blog/)
