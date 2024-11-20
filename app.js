<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>고속버스 터미널 시간표 조회</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    }
    h1 {
      text-align: center;
      margin-top: 20px;
      color: #333;
    }
    form {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    label {
      display: block;
      margin-top: 10px;
      font-weight: bold;
      color: #555;
    }
    select, input[type="date"], button {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }
    button {
      background-color: #007bff;
      color: #fff;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #0056b3;
    }

    /* 모바일 최적화 */
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      form {
        width: 100%;
        padding: 15px;
        border-radius: 5px;
      }
      label {
        font-size: 14px;
      }
      select, input[type="date"], button {
        font-size: 13px;
        padding: 8px;
      }
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 18px;
        margin-top: 10px;
      }
      form {
        padding: 10px;
      }
      label {
        font-size: 12px;
      }
      select, input[type="date"], button {
        font-size: 12px;
        padding: 6px;
      }
      button {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <h1>고속버스 터미널 시간표 조회</h1>
  <form action="/schedule" method="POST" target="_self">
    <label for="dep_terminal_id">출발 터미널:</label>
    <select name="dep_terminal_id" id="dep_terminal_id" required>
      <option value="" disabled selected>터미널을 선택해 주세요</option>
      <% terminals.forEach(terminal => { %>
        <option value="<%= terminal.terminalId %>"><%= terminal.terminalNm %></option>
      <% }) %>
    </select>

    <label for="arr_terminal_id">도착 터미널:</label>
    <select name="arr_terminal_id" id="arr_terminal_id" required>
      <option value="" disabled selected>터미널을 선택해 주세요</option>
      <% terminals.forEach(terminal => { %>
        <option value="<%= terminal.terminalId %>"><%= terminal.terminalNm %></option>
      <% }) %>
    </select>

    <label for="dep_date">출발 날짜:</label>
    <select name="dep_date" id="dep_date" required>
      <option value="" disabled selected>출발 날짜를 선택해 주세요</option>
      <% dates.forEach(date => { %>
        <option value="<%= date %>"><%= date %></option>
      <% }) %>
    </select>

    <button type="submit">시간표 조회</button>
  </form>
</body>
</html>
