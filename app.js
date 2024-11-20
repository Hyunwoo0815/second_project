const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// API 요청에 필요한 정보
const BASE_URL = "http://apis.data.go.kr/1613000/ExpBusInfoService";
const SERVICE_KEY =
  "WKp1VvR7awnciw/bWZyS/ucpv8Tiihgn8LgHK7a7Hw0u+ewXMZNo7buPDOywQc2k7pjJssVL39S0Oe6RWzCa3w==";

// Express 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// XML 데이터를 파싱하는 함수
const parseXML = async (xmlData) => {
  const { parseStringPromise } = require("xml2js");
  return await parseStringPromise(xmlData, { explicitArray: false });
};

// 고속버스 터미널 목록 가져오기
const getAllBusTerminals = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getExpBusTrminlList`, {
      params: {
        serviceKey: SERVICE_KEY,
        _type: "xml",
        pageNo: 1,
        numOfRows: 3000,
      },
    });
    const parsedData = await parseXML(response.data);
    return parsedData.response.body.items.item || [];
  } catch (error) {
    console.error("Error fetching terminals:", error.message);
    return [];
  }
};

// 현재 날짜부터 7일간의 날짜 생성 함수
const getNextSevenDays = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i); // i일 후의 날짜 계산
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    dates.push(formattedDate);
  }
  return dates;
};

// 메인 페이지 라우트
app.get("/", async (req, res) => {
  try {
    const terminals = await getAllBusTerminals(); // 터미널 목록 가져오기
    const dates = getNextSevenDays(); // 7일간의 날짜 생성
    res.render("index", { terminals, dates }); // 터미널 목록과 날짜 전달
  } catch (error) {
    console.error("Error rendering index page:", error.message);
    res.render("index", { terminals: [], dates: [], error: "데이터를 불러올 수 없습니다." });
  }
});

// 시간표 조회 라우트
app.post("/schedule", async (req, res) => {
    const { dep_terminal_id, arr_terminal_id, dep_date } = req.body;
  
    try {
      const response = await axios.get(`${BASE_URL}/getStrtpntAlocFndExpbusInfo`, {
        params: {
          serviceKey: SERVICE_KEY,
          _type: "xml",
          depTerminalId: dep_terminal_id,
          arrTerminalId: arr_terminal_id,
          depPlandTime: dep_date.replace(/-/g, ""), // YYYYMMDD 형식으로 변환
          numOfRows: 100,
        },
      });
  
      // API 응답 데이터 파싱
      const parsedData = await parseXML(response.data);
      const buses = (parsedData.response.body.items.item || []).map(bus => ({
        depPlandTime: bus.depPlandTime,
        fare: bus.charge || "N/A", // `charge` 항목을 요금으로 사용
      }));
  
      res.render("result", { buses, error: null });
    } catch (error) {
      console.error("Error fetching schedule:", error.message);
      res.render("result", { buses: [], error: "스케줄 데이터를 불러올 수 없습니다." });
    }
  });
  

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
