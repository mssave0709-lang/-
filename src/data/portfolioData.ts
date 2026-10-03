import { PortfolioItem } from '../types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // ========================================================
  // 1. 광고 (Advertising / Commercial / TVC)
  // ========================================================
  {
    id: 'ad-wellness-spa',
    badge: '[IT/소프트웨어]',
    title: '딜라이브 광고용 셋톱박스 홍보 영상 - 공간의 재발견 편',
    clientOrStore: "딜라이브 (D'Live)",
    category: '광고',
    targetIndustryTag: '#소상공인 #카페 #식당 #매장메뉴보드',
    tags: ['#소상공인 #카페 #식당 #매장메뉴보드', '광고'],
    duration: '00:59',
    videoFormat: '16:9 FHD (1920x1080)',
    summary: '복잡한 설치 없이 매장의 일상을 특별한 작품으로 만들어주는 스마트 셋톱박스 솔루션',
    description: "소상공인(베이커리, 카페, 일반 식당)의 바쁘고 평범한 일상에 셋톱박스가 자연스럽게 스며드는 과정을 담았습니다. '선 두 개면 충분한' 간편한 설치를 강조하며, 디지털 사이니지 도입이 어렵다는 편견을 깨고 누구든 쉽게 매장 공간을 스마트하고 세련되게 바꿀 수 있다는 점을 감성적인 스토리텔링으로 기획했습니다.",
    videoUrl: 'https://youtu.be/KLHyT2O_UkI',
    videoThumbnail: 'https://img.youtube.com/vi/KLHyT2O_UkI/hqdefault.jpg',
    videoFrames: [
      'https://img.youtube.com/vi/KLHyT2O_UkI/hqdefault.jpg',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      'OPEN 팻말을 걸며 시작되는 소상공인의 따뜻한 하루 오프닝 ("불을 밝히는 매일의 시작")',
      '복잡한 배선 없이 선 2개로 완성되는 디지털 메뉴보드 솔루션 ("작은 기기 하나, 선 두 개면 충분하니까")',
      '카페·베이커리·요식업 점주님의 실제 니즈를 담아낸 감성 스토리텔링 ("내 작은 가게에 딱 맞게")',
      'D\'LIVE Plus OTT 셋톱박스 본체 및 우드 텍스처 패키지 디자인 쇼케이스 ("공간의 재발견")'
    ],
    keyMessage: '"사장님의 정직한 하루가 작품이 되도록, 공간의 재발견"',
    productionNotes: '이른 새벽의 차분하고 푸른 톤(새벽 공기)에서 시작해, 매장에 불을 밝히고 활기를 띠면서 따뜻한 웜톤(오렌지/우드 톤)으로 전환되는 시네마틱 컬러 그레이딩을 적용했습니다. 잔잔하고 서정적인 BGM과 내레이션을 더해 제품의 기술력보다는 사용자의 편의와 공간의 감성에 집중할 수 있도록 연출했습니다.',
    targetAudience: '카페, 베이커리, 프랜차이즈, 일반 요식업 등 디지털 메뉴보드 도입을 고려하는 모든 소상공인 타겟. 매장 입구의 스탠드형 DID 사이니지 및 카운터 상단 가로형 메뉴보드 디스플레이 송출에 적극 권장합니다.'
  },
  {
    id: 'ad-smart-home-iot',
    badge: '[광고]',
    title: '미래형 라이프스타일 스마트 IoT 주거 솔루션 브랜드 영상',
    clientOrStore: '루미엔 스마트라이프 (Lumien IoT)',
    category: '광고',
    targetIndustryTag: '#스타트업/테크',
    tags: ['#스타트업/테크', '#광고', '#3D모션', '#스마트홈'],
    duration: '00:45 풀버전',
    videoFormat: '16:9 4K UHD 가로형 (3840×2160)',
    summary: '스마트폰 탭 한 번으로 조명, 온도, 보안이 연결되는 첨단 스마트홈 솔루션을 감각적인 3D 그래픽과 인터랙션 모션으로 표현했습니다.',
    description: '복잡한 테크 기술을 직관적인 비주얼 언어로 치환하여 소비자가 일상 속 편리함을 즉각적으로 체감할 수 있도록 구성한 영상입니다. 메인 박람회 부스 스크린 및 온라인 광고용으로 납품되었습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '스마트홈 IoT 기기 간 무선 신호 연결을 형상화한 라이트 라인 모션',
      '애프터이펙트 기반의 정밀 3D 카메라 트래킹 및 HUD 인터페이스 그래픽',
      '모던 테크 감성의 딥 블루 & 네온 사이언 톤 컬러'
    ]
  },

  // ========================================================
  // 2. 숏폼 (Short-form / Reels / Shorts / TikTok)
  // ========================================================
  {
    id: 'short-cafe-croissant',
    badge: '[숏폼]',
    title: '성수동 핫플 멜팅 바질 크루아상 침샘 자극 바이럴 숏폼',
    clientOrStore: '버터블랑 베이커리 성수',
    category: '숏폼',
    targetIndustryTag: '#카페/식당',
    tags: ['#카페/식당', '#숏폼', '#인스타릴스', '#바이럴'],
    duration: '00:15 루프',
    videoFormat: '9:16 세로형 4K UHD (1080×1920)',
    summary: '바삭하게 부서지는 페이스트리 결 사운드(ASMR)와 치즈가 늘어나는 순간을 3초 만에 시선 강탈하도록 편집한 세로형 숏폼입니다.',
    description: '인스타그램 릴스와 유튜브 쇼츠 알고리즘을 겨냥하여 첫 1초 후킹 컷과 비트 싱크 컷편집을 적용했습니다. 업로드 2주 만에 조회수 18만 회를 돌파하며 매장 방문 고객을 대폭 견인했습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '경쾌한 비트 타이밍에 맞춘 0.5초 템포의 스피디한 컷 전환',
      '시각적 만족감을 극대화한 슬로모션 버터 글레이징 줌인 효과',
      '화면 하단 자막 가림 방지 Safe Area 맞춤 키네틱 타이포 자막'
    ]
  },
  {
    id: 'short-balance-fit',
    badge: '[숏폼]',
    title: '바른 체형 교정 & 코어 스트레칭 3분 챌린지 세로형 숏폼',
    clientOrStore: '밸런스핏 필라테스 & 체형교정센터',
    category: '숏폼',
    targetIndustryTag: '#병원/클리닉',
    tags: ['#병원/클리닉', '#숏폼', '#필라테스', '#릴스'],
    duration: '00:20 루프',
    videoFormat: '9:16 세로형 Full HD (1080×1920)',
    summary: '직장인들의 거북목과 허리 통증을 잡아주는 홈트 동작을 그래픽 가이드라인과 함께 직관적으로 전달하는 숏폼 영상입니다.',
    description: '전문 강사의 시연 영상 위에 근육의 자극 부위를 형상화한 모션 라인을 덧입혀 보는 즉시 따라 할 수 있도록 설계되었습니다. 신규 회원 체험권 프로모션과 연계되었습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '신체 관절 및 척추 라인을 추적하는 다이내믹 모션 트래커 가이드',
      '동작 카운트다운 타이머 UI 애니메이션',
      '신규 체험 예약 링크 유도 엔딩 콜투액션(CTA) 팝업'
    ]
  },

  // ========================================================
  // 3. 인포그래픽 (Infographic)
  // ========================================================
  {
    id: 'clinic-care-infographic',
    badge: '[인포그래픽]',
    title: '척추관절 비수술 재생 치료 원리 인포그래픽',
    clientOrStore: '바른서울정형외과의원 (Clinic Care)',
    category: '인포그래픽',
    targetIndustryTag: '#병원/클리닉',
    tags: ['#병원/클리닉', '#인포그래픽', '#의료DID', '#환자안내'],
    duration: '01:15 루프',
    videoFormat: '16:9 4K UHD 대기실 모니터 규격',
    summary: '환자들이 이해하기 어려운 전문 의학 치료 과정을 3D 그래픽과 친절한 인포그래픽 모션으로 시각화한 병의원 대기실 전용 솔루션입니다.',
    description: '대기실에 머무는 환자들의 불안감을 줄이고 의료진의 전문성을 신뢰할 수 있도록, 치료 전후의 뼈와 관절 메커니즘을 군더더기 없는 도식과 모션으로 해설합니다. 소리 없이 자막만으로도 핵심이 완벽히 전달됩니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '척추 관절 및 신경 재생 프로세스를 시각화한 모던 3D 다이어그램',
      '어르신도 편안하게 읽을 수 있는 고대비 폰트 및 핵심 키워드 강조',
      '병원 신뢰도를 높여주는 클린 화이트 & 메디컬 틸 톤 디자인'
    ]
  },
  {
    id: 'academy-curriculum-infographic',
    badge: '[인포그래픽]',
    title: '명문대 입시 로드맵 & 1:1 맞춤 관리 인포그래픽',
    clientOrStore: '프라임 에듀케이션 아카데미',
    category: '인포그래픽',
    targetIndustryTag: '#학교/학원',
    tags: ['#학교/학원', '#인포그래픽', '#입시설명', '#학원홍보'],
    duration: '01:00 루프',
    videoFormat: '16:9 4K UHD 로비 디스플레이',
    summary: '학부모 상담실 및 학원 로비에서 복잡한 연간 커리큘럼과 입시 합격 지표를 한눈에 각인시키는 데이터 인포그래픽 영상입니다.',
    description: '단순한 글자 위주의 설명회를 보완하여, 학원의 성과 지표(합격률, 성적 향상도)를 그래프 인터랙션과 직관적인 플로우차트로 구현했습니다. 상담 대기 시간 동안 학원의 커리큘럼 우수성을 자연스럽게 입증합니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '학습 단계별 성장을 보여주는 단계별 로드맵 인터랙션',
      '합격률 통계 데이터를 감각적으로 표현한 모션 인포그래픽 차트',
      '학부모의 시선을 붙잡는 신뢰감 있는 딥 네이비 & 에메랄드 컬러'
    ]
  },
  {
    id: 'dental-guide-infographic',
    badge: '[인포그래픽]',
    title: '임플란트 수술 후 주의사항 & 평생 치아 관리 가이드',
    clientOrStore: '미소라인 치과의원',
    category: '인포그래픽',
    targetIndustryTag: '#병원/클리닉',
    tags: ['#병원/클리닉', '#치과', '#수술후관리', '#인포그래픽'],
    duration: '00:50 루프',
    videoFormat: '16:9 Full HD & 9:16 세로형 키오스크 규격',
    summary: '환자가 치료 후 꼭 지켜야 할 일상 관리 수칙을 귀여운 캐릭터 일러스트와 깔끔한 모션 인포그래픽으로 설명합니다.',
    description: '치과 데스크와 회복실에서 반복적으로 안내해야 하는 번거로움을 줄이고, 환자가 귀가 전 잊지 않고 주의사항을 숙지할 수 있도록 명료하게 정리했습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '직관적인 픽토그램과 체크리스트 인터랙션',
      '거부감 없는 부드러운 파스텔톤 컬러감과 아이콘 애니메이션',
      '세로형 DID 및 가로형 모니터 맞춤형 듀얼 렌더링'
    ]
  },

  // ========================================================
  // 4. 디지털 메뉴보드 (Digital Menu Board)
  // ========================================================
  {
    id: 'cafe-signature-menuboard',
    badge: '[디지털 메뉴보드]',
    title: '시그니처 로스터리 커피 & 브런치 모션 메뉴보드',
    clientOrStore: '카페 오브제 (Cafe Objet)',
    category: '디지털 메뉴보드',
    targetIndustryTag: '#카페/식당',
    tags: ['#카페/식당', '#디지털메뉴판', '#모션그래픽', '#F&B'],
    duration: '00:30 루프',
    videoFormat: '16:9 4K UHD 가로형 (3840×2160)',
    summary: '정적인 텍스트 메뉴판에서 탈피하여, 에스프레소 크레마와 갓 구운 베이커리의 신선함을 실사 촬영과 AI 모션으로 구현한 디지털 메뉴보드입니다.',
    description: '원두가 로스팅되고 커피가 추출되는 생생한 실사 영상과 모던한 폰트 타이포그래피를 결합하여 고객의 시선과 주문을 유도합니다. 계절별 신메뉴 프로모션 애니메이션이 자동으로 전환됩니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '스팀과 에스프레소 방울의 극세밀 슬로모션 파티클 연출',
      '가독성을 극대화한 가격·메뉴 설명 키네틱 타이포그래피',
      '매장 조도에 맞춘 화이트 & 웜톤 하이엔드 컬러 그레이딩'
    ]
  },
  {
    id: 'bakery-artisan-menuboard',
    badge: '[디지털 메뉴보드]',
    title: '천연발효 프리미엄 베이커리 타임 세일 메뉴보드',
    clientOrStore: '아티장 브레드 팩토리',
    category: '디지털 메뉴보드',
    targetIndustryTag: '#카페/식당',
    tags: ['#카페/식당', '#베이커리', '#메뉴보드', '#타임세일'],
    duration: '00:45 루프',
    videoFormat: '16:9 4K UHD 가로형',
    summary: '빵이 오븐에서 부풀어 오르는 순간을 따뜻한 색감으로 포착하여, 방문객의 후각과 시각을 동시에 자극하는 베이커리 특화 디지털 DID 보드입니다.',
    description: '시간대별(오전 브런치 / 오후 티타임 / 저녁 타임세일)로 화면 레이아웃이 자동 변경되도록 기획되었습니다. 애프터이펙트를 활용해 빵의 텍스처를 돋보이게 하는 섬세한 모션 그래픽이 적용되었습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '오븐 열기와 갓 구운 질감을 강조한 빛 반사 시각 효과',
      '베스트셀러 품목 하이라이트 뱃지 모션 인터랙션',
      '카운터 상단 3단 멀티 모니터 완벽 연동 심리스 레이아웃'
    ]
  },
  {
    id: 'dining-wine-menuboard',
    badge: '[디지털 메뉴보드]',
    title: '모던 이탈리안 다이닝 & 와인 페어링 디지털 보드',
    clientOrStore: '트라토리아 비노 (Trattoria Vino)',
    category: '디지털 메뉴보드',
    targetIndustryTag: '#카페/식당',
    tags: ['#카페/식당', '#다이닝', '#와인바', '#메뉴보드'],
    duration: '01:00 루프',
    videoFormat: '21:9 울트라와이드 (3840×1646)',
    summary: '코스 요리의 조리 과정과 와인 글라스의 우아한 실루엣을 담아 고급스러운 매장 인테리어를 완성하는 하이엔드 디지털 메뉴보드입니다.',
    description: '단순 메뉴 나열이 아닌, 쉐프의 조리 철학과 식재료의 원산지 스토리를 감성적으로 전달합니다. 은은한 조명의 레스토랑 무드에 녹아들 수 있도록 절제된 모션 템포를 적용했습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '와인 글라스 굴절과 유려한 액체 흐름 시각화',
      '프리미엄 레스토랑에 걸맞은 세리프 폰트 모션 트랜지션',
      '저조도 환경에서도 눈이 편안한 딥 차콜 베이스 비주얼'
    ]
  },

  // ========================================================
  // 5. 영상 카드뉴스 (Video Card News)
  // ========================================================
  {
    id: 'beauty-salon-cardnews',
    badge: '[영상 카드뉴스]',
    title: '퍼스널 헤어 & 두피 스파 이달의 멤버십 숏폼 카드뉴스',
    clientOrStore: '살롱 드 뤼미에르 (Salon Lumière)',
    category: '영상 카드뉴스',
    targetIndustryTag: '#뷰티/헤어',
    tags: ['#뷰티/헤어', '#영상카드뉴스', '#숏폼', '#살롱홍보'],
    duration: '00:30 루프',
    videoFormat: '9:16 세로형 숏폼 & 16:9 매장 DID 듀얼 규격',
    summary: '인스타그램 릴스 및 매장 스탠드 DID 모니터에 최적화된 고감도 비주얼의 뷰티 영상 카드뉴스입니다.',
    description: '트렌디한 헤어 스타일링 시술 전후 비교와 VIP 두피 스파 프로모션 혜택을 5초 단위 숏폼 컷으로 구성했습니다. 세련된 매거진 레이아웃 스타일로 고객의 스마트폰 촬영 욕구를 자극합니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '모바일 SNS 피드 및 매장 DID 화면에 동시 최적화된 카드 슬라이드',
      '모델 헤어 윤기와 볼륨감을 극대화한 슬로모션 라이팅',
      '이달의 할인율과 예약 바로가기 QR코드가 강조되는 모션 그래픽'
    ]
  },
  {
    id: 'school-event-cardnews',
    badge: '[영상 카드뉴스]',
    title: '스마트 러닝 센터 신학기 오픈 이벤트 영상 카드뉴스',
    clientOrStore: '미래 코딩 아카데미 (Future Coding)',
    category: '영상 카드뉴스',
    targetIndustryTag: '#학교/학원',
    tags: ['#학교/학원', '#영상카드뉴스', '#신학기이벤트', '#코딩학원'],
    duration: '00:25 루프',
    videoFormat: '9:16 모바일 & 16:9 가로형',
    summary: '학부모와 학생들이 빠르게 핵심만 읽을 수 있도록 템포감 있게 넘어가는 뉴스 형태의 모션 카드뉴스입니다.',
    description: '신학기 개강 일정, 장학 혜택, 무료 체험 수업 신청 안내를 뉴스 자막과 애니메이션 일러스트로 명쾌하게 구성하여 문의 전환율을 극대화합니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '빠른 스크롤에도 눈길을 끄는 다이내믹 텍스트 팝업 모션',
      '직관적인 카운트다운 및 등록 마감 임박 효과',
      '학원 카카오톡 채널 및 네이버 예약 링크 직결 연동'
    ]
  },
  {
    id: 'specialty-roastery-cardnews',
    badge: '[영상 카드뉴스]',
    title: '싱글오리진 스페셜티 원두 입고 소식 영상 카드뉴스',
    clientOrStore: '루트 커피 로스터스',
    category: '영상 카드뉴스',
    targetIndustryTag: '#카페/식당',
    tags: ['#카페/식당', '#영상카드뉴스', '#스페셜티원두', '#인스타스토리'],
    duration: '00:20 루프',
    videoFormat: '9:16 세로형 & 16:9 가로형',
    summary: '매주 변경되는 스페셜티 원두의 산미, 바디감, 테이스팅 노트를 커피 애호가들의 감성에 맞춘 카드뉴스로 풀어냈습니다.',
    description: '원산지 농장 풍경과 컵핑 노트를 한 편의 매거진처럼 모션으로 편집하여, 단골 손님들의 매장 방문과 원두 구매를 활성화합니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '테이스팅 노트 플레이버 휠 모션 그래픽',
      '자연스러운 스와이프 느낌의 카드 트랜지션',
      '원두 패키지 사진과 추출 실사 컷의 유기적 결합'
    ]
  },

  // ========================================================
  // 6. 카드뉴스 (Card News / SNS Carousel)
  // ========================================================
  {
    id: 'cardnews-legal-incorporation',
    badge: '[카드뉴스]',
    title: '스타트업 1인 법인 설립 절차 및 절세 체크리스트 카드뉴스',
    clientOrStore: '로앤파트너스 법률사무소',
    category: '카드뉴스',
    targetIndustryTag: '#스타트업/테크',
    tags: ['#스타트업/테크', '#카드뉴스', '#법률자문', '#절세정보'],
    duration: '총 6장 구성',
    videoFormat: '1:1 정방형 (1080×1080) 인스타그램 최적화',
    summary: '복잡한 법인 설립 법률 요건과 과세 감면 혜택을 깔끔한 인포그래픽 카드뉴스로 요약하여 높은 스크랩 수를 기록한 콘텐츠입니다.',
    description: '신규 창업자들이 가장 많이 묻는 5대 질문을 Q&A 형식의 카드뉴스로 구성했습니다. 공식 블로그 및 인스타그램 피드 배포용으로 제작되었습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '시선 집중을 유도하는 볼드 타이틀 폰트와 간결한 3단 요약',
      '한눈에 읽히는 단계별 플로우차트 도식화',
      '신뢰도를 전달하는 클래식 네이비 & 골드 옐로우 포인트'
    ]
  },
  {
    id: 'cardnews-rhinitis-care',
    badge: '[카드뉴스]',
    title: '환절기 소아 알레르기 비염 예방 & 가정 관리 수칙 카드뉴스',
    clientOrStore: '아이사랑 이비인후과 의원',
    category: '카드뉴스',
    targetIndustryTag: '#병원/클리닉',
    tags: ['#병원/클리닉', '#카드뉴스', '#소아건강', '#의료상식'],
    duration: '총 5장 구성',
    videoFormat: '1:1 정방형 (1080×1080) SNS & 원내 배포',
    summary: '부모님들이 일상에서 바로 실천할 수 있는 코 세척법과 실내 습도 관리 팁을 친근한 캐릭터 일러스트와 함께 담아낸 카드뉴스입니다.',
    description: '병원 대기실 태블릿 및 카카오톡 채널 메시지로 환자 보호자들에게 발송되어 높은 만족도와 진료 신뢰를 형성한 대표 사례입니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '부드럽고 안정감을 주는 베이비 민트 & 소프트 옐로우 컬러 배색',
      '텍스트 과밀 방지 및 직관적인 픽토그램 가이드',
      '원내 데스크 문의 및 네이버 예약 바로가기 QR코드 수록'
    ]
  },

  // ========================================================
  // 7. 브랜딩 동화 (Branding Fairy Tale / Brand Storybook)
  // ========================================================
  {
    id: 'fairytale-jeju-tangerine',
    badge: '[브랜딩 동화]',
    title: '별빛 귤밭의 아기 노루 이야기 - 제주 친환경 감귤 농원 브랜드 동화',
    clientOrStore: '별빛귤밭 제주 (Jeju Starlight Orchard)',
    category: '브랜딩 동화',
    targetIndustryTag: '#농업/스마트팜',
    tags: ['#농업/스마트팜', '#특산물/로컬푸드', '#브랜딩동화', '#캐릭터동화', '#스토리텔링'],
    duration: '01:30 동화 풀스토리',
    videoFormat: '16:9 4K UHD 가로형 (3840×2160)',
    summary: '제주 한라산 자락 유기농 귤밭에 찾아온 아기 노루와의 따뜻한 교감을 수채화풍 동화 일러스트와 힐링 나레이션 모션으로 엮어낸 감성 브랜딩 동화입니다.',
    description: '단순 상품 판매를 넘어 농장의 철학과 진심을 한 편의 동화책을 읽어주는 듯한 영상미로 완성했습니다. 브랜드 캐릭터 기획부터 AI 수채화 일러스트 생성, 은은한 페이퍼 텍스처 모션, 따뜻한 성우 나레이션을 더해 소비자의 팬덤을 구축했습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '동화책 책장이 부드럽게 넘어가는 3D 페이징 및 페이퍼 팝업 애니메이션',
      '몽환적인 밤하늘 별빛과 귤꽃 잎이 흩날리는 2D 파티클 이펙트',
      '따뜻한 아날로그 수채화 터치감과 캐릭터의 사랑스러운 아이 콘택트 모션'
    ]
  },
  {
    id: 'fairytale-kids-dental',
    badge: '[브랜딩 동화]',
    title: '치아 요정 루루와 충치 괴물 소탕 작전 - 어린이 치과 공포 극복 원내 상영 동화',
    clientOrStore: '연세아이사랑 키즈치과 의원',
    category: '브랜딩 동화',
    targetIndustryTag: '#병원/클리닉',
    tags: ['#병원/클리닉', '#브랜딩동화', '#키즈애니메이션', '#치과공포극복', '#원내상영'],
    duration: '02:00 루프 스토리',
    videoFormat: '16:9 FHD 대기실 DID (1920×1080)',
    summary: '치과 치료를 무서워하는 어린이 환자들을 위해 기획된 동화 영상으로, 치아 요정 캐릭터가 등장해 치료 도구를 친근한 마법 도구로 소개해 줍니다.',
    description: '대기실과 진료실 체어 모니터에 상영되어 소아 환자의 진료 협조도를 비약적으로 상승시킨 베스트 프로젝트입니다. 캐릭터 디자인과 대화형 동화 구성을 통해 부모님들의 신뢰와 안도감을 함께 잡았습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '통통 튀는 2D 카툰 프레임 바이 프레임 모션과 말풍선 사운드 싱크',
      '진료 도구를 별빛 지팡이, 바람 요술봉으로 유쾌하게 치환한 캐릭터 인터랙션',
      '어린이의 눈높이에 맞춘 파스텔 비비드 컬러 팔레트와 경쾌한 리듬감'
    ]
  },
  {
    id: 'fairytale-forest-bakery',
    badge: '[브랜딩 동화]',
    title: '새벽 4시 달빛 오븐의 비밀 - 숲속 유기농 베이커리 브랜드 스토리북 동화',
    clientOrStore: '모리노베이커리 (Forest Artisan Bread)',
    category: '브랜딩 동화',
    targetIndustryTag: '#카페/식당',
    tags: ['#카페/식당', '#브랜딩동화', '#동화책', '#베이커리브랜딩', '#스토리텔링'],
    duration: '01:15 감성 모션',
    videoFormat: '1:1 정방형 & 16:9 가로형',
    summary: '천연 발효종을 키우는 파티시에와 숲속 동물 이웃들이 함께 빵을 굽는 따스한 우화를 색연필 일러스트 감성으로 담아낸 매장 상영용 동화입니다.',
    description: '매장 DID 및 브랜드 SNS에 연재되는 시그니처 콘텐츠로, 원재료의 정성과 건강한 빵의 가치를 동화적 판타지로 승화시켰습니다. 동화 엽서 굿즈 및 패키지 디자인과 연계되어 브랜드 가치를 드높였습니다.',
    videoThumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1400&auto=format&fit=crop',
    videoFrames: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200&auto=format&fit=crop'
    ],
    motionFeatures: [
      '따스한 질감의 아날로그 색연필 텍스처와 빛바랜 파치먼트 종이 질감 연출',
      '오븐 속에서 빵이 부풀어 오르는 마법 같은 몽환적 슬로우 줌인',
      '매장 공간에 은은하게 어우러지는 잔잔한 어쿠스틱 오르골 BGM 모션'
    ]
  }
];
