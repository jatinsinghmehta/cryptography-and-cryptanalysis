import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [activeTool, setActiveTool] = useState("caesar");

  const [caesarText, setCaesarText] = useState("");
  const [caesarShift, setCaesarShift] = useState("");

  const [vigenereText, setVigenereText] = useState("");
  const [vigenereKey, setVigenereKey] = useState("");

  const [analysisText, setAnalysisText] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cipherHistory, setCipherHistory] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const clearMessages = () => {
    setResult(null);
    setError("");
  };

  const handleError = (message) => {
    setLoading(false);
    setError(message);
  };

  // =========================================================
  // Caesar
  // =========================================================

  const caesarOperation = async (operation) => {
    clearMessages();

    if (!caesarText.trim()) {
      handleError("Please enter some text.");
      return;
    }

    if (operation !== "brute-force" && caesarShift === "") {
      handleError("Please enter a shift value.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (operation === "brute-force") {
        response = await fetch(`${API_URL}/caesar/brute-force`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: caesarText,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/caesar/${operation}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: caesarText,
            shift: Number(caesarShift),
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch {
      handleError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Vigenère
  // =========================================================

  const vigenereOperation = async (operation) => {
    clearMessages();

    if (!vigenereText.trim()) {
      handleError("Please enter some text.");
      return;
    }

    if (!vigenereKey.trim()) {
      handleError("Please enter an encryption key.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/vigenere/${operation}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: vigenereText,
            key: vigenereKey,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch {
      handleError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Frequency Analysis
  // =========================================================

  const analyzeFrequency = async () => {
    clearMessages();

    if (!analysisText.trim()) {
      handleError("Please enter text for analysis.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/analysis/frequency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: analysisText,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch {
      handleError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // History
  // =========================================================

  const loadHistory = async () => {
    clearMessages();
    setLoading(true);

    try {
      const [cipherResponse, analysisResponse] = await Promise.all([
        fetch(`${API_URL}/history/cipher`),
        fetch(`${API_URL}/history/analysis`),
      ]);

      if (!cipherResponse.ok || !analysisResponse.ok) {
        throw new Error("History request failed");
      }

      const cipherData = await cipherResponse.json();
      const analysisData = await analysisResponse.json();

      setCipherHistory(cipherData);
      setAnalysisHistory(analysisData);
    } catch {
      handleError(
        "Unable to load history. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Navigation
  // =========================================================

  const changeTool = (tool) => {
    setActiveTool(tool);
    clearMessages();

    if (tool === "history") {
      loadHistory();
    }
  };

  return (
    <div className="app">

      {/* =====================================================
          Header
      ===================================================== */}

      <header className="header">
        <div className="header-content">

          <div className="brand">
            <div className="brand-icon">🔐</div>

            <div>
              <h1>Cryptography Toolkit</h1>
              <p>Encryption, Decryption & Cryptanalysis</p>
            </div>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            API Connected
          </div>

        </div>
      </header>

      {/* =====================================================
          Main
      ===================================================== */}

      <main className="container">

        <div className="welcome">
          <h2>Cryptography & Cryptanalysis</h2>
          <p>
            Explore classical encryption techniques and analyze
            encrypted text using an interactive toolkit.
          </p>
        </div>

        {/* ===================================================
            Navigation
        =================================================== */}

        <div className="tool-tabs">

          <button
            className={activeTool === "caesar" ? "active" : ""}
            onClick={() => changeTool("caesar")}
          >
            <span>🔄</span>
            Caesar Cipher
          </button>

          <button
            className={activeTool === "vigenere" ? "active" : ""}
            onClick={() => changeTool("vigenere")}
          >
            <span>🔑</span>
            Vigenère Cipher
          </button>

          <button
            className={activeTool === "analysis" ? "active" : ""}
            onClick={() => changeTool("analysis")}
          >
            <span>📊</span>
            Frequency Analysis
          </button>

          <button
            className={activeTool === "history" ? "active" : ""}
            onClick={() => changeTool("history")}
          >
            <span>🕒</span>
            History
          </button>

        </div>

        {/* ===================================================
            Main Card
        =================================================== */}

        <section className="card">

          {/* =================================================
              Caesar
          ================================================= */}

          {activeTool === "caesar" && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Caesar Cipher</h2>
                  <p>
                    Shift letters by a fixed number to encrypt or
                    decrypt your message.
                  </p>
                </div>

                <span className="badge">CLASSICAL CIPHER</span>
              </div>

              <label>Input Text</label>

              <textarea
                value={caesarText}
                onChange={(e) => setCaesarText(e.target.value)}
                placeholder="Enter your message here..."
              />

              <div className="control-grid">

                <div className="field">
                  <label>Shift Value</label>

                  <input
                    type="number"
                    value={caesarShift}
                    onChange={(e) => setCaesarShift(e.target.value)}
                    placeholder="e.g. 3"
                  />
                </div>

                <div className="action-group">

                  <button
                    className="primary-button"
                    onClick={() => caesarOperation("encrypt")}
                  >
                    Encrypt
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => caesarOperation("decrypt")}
                  >
                    Decrypt
                  </button>

                  <button
                    className="dark-button"
                    onClick={() => caesarOperation("brute-force")}
                  >
                    Brute Force
                  </button>

                </div>

              </div>

              {loading && (
                <div className="message loading">
                  Processing request...
                </div>
              )}

              {error && (
                <div className="message error">
                  ⚠ {error}
                </div>
              )}

              {result && !loading && !error && (
                <div className="output">

                  <div className="output-header">
                    <h3>Result</h3>
                    <span>SUCCESS</span>
                  </div>

                  {result.operation === "brute force" ? (
                    <>
                      {result.best_candidate && (
                        <div className="best-result">
                          <p>Best Candidate</p>

                          <strong>
                            {result.best_candidate.result}
                          </strong>

                          <div className="result-meta">
                            <span>
                              Shift: {result.best_candidate.shift}
                            </span>

                            <span>
                              Score: {result.best_candidate.score}
                            </span>
                          </div>
                        </div>
                      )}

                      <h3 className="sub-heading">
                        All Candidates
                      </h3>

                      <div className="candidate-list">
                        {result.candidates.map((candidate) => (
                          <div
                            className="candidate"
                            key={candidate.shift}
                          >
                            <span>
                              Shift {candidate.shift}
                            </span>

                            <span className="candidate-text">
                              {candidate.result}
                            </span>

                            <span>
                              {candidate.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-result">
                      {result.result}
                    </div>
                  )}

                </div>
              )}
            </>
          )}

          {/* =================================================
              Vigenère
          ================================================= */}

          {activeTool === "vigenere" && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Vigenère Cipher</h2>
                  <p>
                    Use a repeating secret key to encrypt or
                    decrypt your message.
                  </p>
                </div>

                <span className="badge">POLYALPHABETIC</span>
              </div>

              <label>Input Text</label>

              <textarea
                value={vigenereText}
                onChange={(e) => setVigenereText(e.target.value)}
                placeholder="Enter your message here..."
              />

              <div className="field">

                <label>Encryption Key</label>

                <input
                  type="text"
                  value={vigenereKey}
                  onChange={(e) => setVigenereKey(e.target.value)}
                  placeholder="Enter secret key..."
                />

              </div>

              <div className="action-group">

                <button
                  className="primary-button"
                  onClick={() => vigenereOperation("encrypt")}
                >
                  Encrypt
                </button>

                <button
                  className="secondary-button"
                  onClick={() => vigenereOperation("decrypt")}
                >
                  Decrypt
                </button>

              </div>

              {loading && (
                <div className="message loading">
                  Processing request...
                </div>
              )}

              {error && (
                <div className="message error">
                  ⚠ {error}
                </div>
              )}

              {result && !loading && !error && (
                <div className="output">

                  <div className="output-header">
                    <h3>Result</h3>
                    <span>SUCCESS</span>
                  </div>

                  <div className="text-result">
                    {result.result}
                  </div>

                </div>
              )}
            </>
          )}

          {/* =================================================
              Frequency Analysis
          ================================================= */}

          {activeTool === "analysis" && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Frequency Analysis</h2>
                  <p>
                    Measure how frequently each letter appears
                    in the supplied text.
                  </p>
                </div>

                <span className="badge">CRYPTANALYSIS</span>
              </div>

              <label>Text to Analyze</label>

              <textarea
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                placeholder="Enter text for frequency analysis..."
              />

              <button
                className="primary-button"
                onClick={analyzeFrequency}
              >
                Analyze Frequency
              </button>

              {loading && (
                <div className="message loading">
                  Analyzing text...
                </div>
              )}

              {error && (
                <div className="message error">
                  ⚠ {error}
                </div>
              )}

              {result && !loading && !error && (
                <div className="output">

                  <div className="output-header">
                    <h3>Frequency Results</h3>
                    <span>ANALYZED</span>
                  </div>

                  {result.result.length === 0 ? (
                    <p>No alphabetic characters found.</p>
                  ) : (
                    <div className="frequency-grid">

                      {result.result.map((item) => (
                        <div
                          className="frequency-item"
                          key={item.letter}
                        >
                          <div className="frequency-top">
                            <strong>{item.letter}</strong>

                            <span>
                              {item.percentage}%
                            </span>
                          </div>

                          <div className="bar">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${Math.min(
                                  item.percentage * 5,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>

                          <small>
                            Count: {item.count}
                          </small>
                        </div>
                      ))}

                    </div>
                  )}

                </div>
              )}
            </>
          )}

          {/* =================================================
              History
          ================================================= */}

          {activeTool === "history" && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Operation History</h2>
                  <p>
                    Previous cryptography operations stored in
                    PostgreSQL.
                  </p>
                </div>

                <span className="badge">DATABASE</span>
              </div>

              {loading && (
                <div className="message loading">
                  Loading history...
                </div>
              )}

              {error && (
                <div className="message error">
                  ⚠ {error}
                </div>
              )}

              {!loading && !error && (
                <>
                  <h3 className="sub-heading">
                    Cipher Operations
                  </h3>

                  {cipherHistory.length === 0 ? (
                    <div className="empty-state">
                      No cipher operations found.
                    </div>
                  ) : (
                    <div className="history-list">

                      {cipherHistory.map((item) => (
                        <div
                          className="history-card"
                          key={`cipher-${item.id}`}
                        >
                          <div className="history-top">
                            <strong>{item.algorithm}</strong>

                            <span>
                              {item.operation}
                            </span>
                          </div>

                          <p>
                            <b>Input:</b>{" "}
                            {item.input_text}
                          </p>

                          <p>
                            <b>Key / Shift:</b>{" "}
                            {item.key_or_shift || "N/A"}
                          </p>

                          <p>
                            <b>Output:</b>{" "}
                            {item.output_text}
                          </p>

                          <small>
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </small>
                        </div>
                      ))}

                    </div>
                  )}

                  <h3 className="sub-heading">
                    Analysis Operations
                  </h3>

                  {analysisHistory.length === 0 ? (
                    <div className="empty-state">
                      No analysis operations found.
                    </div>
                  ) : (
                    <div className="history-list">

                      {analysisHistory.map((item) => (
                        <div
                          className="history-card"
                          key={`analysis-${item.id}`}
                        >
                          <div className="history-top">
                            <strong>
                              {item.analysis_type}
                            </strong>

                            <span>analysis</span>
                          </div>

                          <p>
                            <b>Input:</b>{" "}
                            {item.input_text}
                          </p>

                          <small>
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </small>
                        </div>
                      ))}

                    </div>
                  )}
                </>
              )}
            </>
          )}

        </section>

        <footer className="footer">
          <span>Cryptography Toolkit</span>
          <span>React • FastAPI • PostgreSQL</span>
        </footer>

      </main>
    </div>
  );
}

export default App;