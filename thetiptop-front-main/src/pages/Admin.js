import { React, useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { CSVLink } from "react-csv";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faCircleUser,
} from "@fortawesome/free-regular-svg-icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "./Admin.css";
import { AgChartsReact } from "ag-charts-react";

const user = JSON.parse(localStorage.getItem("user"));

const Admin = () => {
  const [bigWinner, setBigWinner] = useState();
  const [bigWinnerError, setBigWinnerError] = useState("");
  const [row, setRow] = useState();
  const [error, setError] = useState("");
  const [mailingList, setMailingList] = useState([]);
  const [mailingListAll, setMailingListAll] = useState([]);
  const [mailingListNews, setMailingListNews] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [tickets, setTickets] = useState({
    gifts_won: "",
    gifts_left: "",
    tickets: [],
  });
  const [chartsData, setChartsData] = useState([
    {
      name: "Cadeaux Gagnés",
      count: 0,
    },
    {
      name: "Cadeaux Restants",
      count: 0,
    },
  ]);

  useEffect(async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/admin/numbers`;
      const { data: res } = await axios.get(url, {
        headers: { authorization: `${user.token}` },
      });
      setNumbers(res.list);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setChartsData([
      {
        name: "Cadeaux Gagnés",
        count: Number(tickets.gifts_won),
      },
      {
        name: "Cadeaux Restants",
        count: Number(tickets.gifts_left),
      },
    ]);
  }, [tickets]);

  const [chartOptions, setChartOptions] = useState();

  useEffect(() => {
    const total = chartsData.reduce((sum, d) => sum + d.count, 0);
    const percentage = (value) => `${((value / total) * 100).toFixed(2)}%`;
    setChartOptions({
      data: chartsData,
      series: [
        {
          type: "pie",
          angleKey: "count",
          fills: ["#35ab7c", "#a0b3b0"],
          highlightStyle: {
            item: {
              fill: "#B8C352",
            },
          },
          strokeWidth: 0,
          innerRadiusOffset: -20,
          innerLabels: [
            {
              text: percentage(chartsData[0].count),
              color: "#35ab7c",
              fontSize: 30,
            },
            {
              text: "de cadeaux ont été gagné",
              fontSize: 10,
              margin: 4,
            },
          ],
          innerCircle: {
            fill: "#dff3ea",
          },
          tooltip: {
            renderer: function (params) {
              return {
                title: params.datum.name,
                content: params.datum.count,
                color: "black",
              };
            },
          },
        },
      ],
    });
  }, [chartsData]);

  const handleBigWin = async () => {
    if (!bigWinner) {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/admin/win`;
        const { data: res } = await axios.get(url, {
          headers: { authorization: `${user.token}` },
        });
        if (bigWinner) throw "Un gagnant à deja été designé";
        setBigWinner({
          name: res.client.name,
          email: res.client.email,
        });
      } catch (e) {
        setBigWinnerError("Une erreur est arrivée");
        console.log(e);
      }
    }
  };

  const [showBigWinModal, setShowBigWinModal] = useState(false);

  const modalRef = useRef(null);

  const doShowBigWinModal = () => {
    setShowBigWinModal(true);
  };

  const doHideBigWinModal = () => {
    setShowBigWinModal(false);
    setBigWinnerError("");
  };

  const gridRef = useRef();

  const handleFilterChange = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-input").value
    );
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutSideModalClick, true);
  });

  const handleOutSideModalClick = (e) => {
    if (showBigWinModal && !modalRef.current.contains(e.target)) {
      doHideBigWinModal();
    }
  };

  const getEmails = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/admin/emails`;
      const { data: res } = await axios.get(url, {
        headers: { authorization: `${user.token}` },
      });
      const fetchedEmails = [];
      res.emails.forEach((email) => {
        if (email.email !== "deleted@user.com")
          fetchedEmails.push({
            name: email.name,
            email: email.email,
          });
      });
      setMailingListAll(fetchedEmails);
    } catch (e) {
      console.error("Error getting Emails ! " + e);
    }
  };

  const getEmailsNews = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/admin/newsletteremails`;
      const { data: res } = await axios.get(url, {
        headers: { authorization: `${user.token}` },
      });
      const fetchedEmails = res.emails.map((email) => {
        return {
          name: email.name,
          email: email.email,
        };
      });
      setMailingListNews(fetchedEmails);
    } catch {
      console.log("Error getting Emails");
    }
  };

  const getError = (error) => {
    if (error.code === axios.AxiosError.ERR_NETWORK)
      return "Une erreur de connexion est arrivée !";
    if (
      error.code === axios.AxiosError.ERR_BAD_REQUEST &&
      error?.response?.data?.message
    )
      return error.response.data.message;
    return "Une erreur inconnue est arrivé !";
  };

  useEffect(() => {
    const getTickets = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/admin/tickets`;
        const { data: res } = await axios.get(url, {
          headers: { authorization: `${user.token}` },
        });
        setTickets({
          gifts_won: res.gifts_won,
          gifts_left: res.gifts_left,
          tickets: res.tickets,
        });
        const fetchedEmails = [];
        res.tickets.forEach((ticket) => {
          if (ticket.gift.isSpecial) {
            if (!bigWinner)
              setBigWinner({
                name: ticket.client.name,
                email: ticket.client.email,
              });
          }
          if (
            ticket.client.email !== "deleted@user.com" &&
            fetchedEmails.findIndex((e) => e.email === ticket.client.email) ===
              -1
          ) {
            fetchedEmails.push({
              name: ticket.client.name,
              email: ticket.client.email,
            });
          }
        });
        setMailingList(fetchedEmails);
        const filteredData = res.tickets.map((ticket) => {
          return {
            Nom: ticket.client.name,
            Email:
              ticket.client.email === "deleted@user.com"
                ? "Utilisateur supprimé"
                : ticket.client.email,
            Cadeau: ticket.gift.name,
            Numero: ticket?.number,
            Received: ticket.received ? "oui" : "non",
            dateGain: new Date(
              new Date(ticket.creation_date).toLocaleString("en-US", {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })
            ).setHours(0, 0, 0, 0),
          };
        });
        setRow(filteredData);
      } catch (error) {
        setError(getError(error));
      }
    };
    getTickets();
    getEmails();
    getEmailsNews();
  }, [bigWinner]);

  return (
    <>
      <Navbar />
      <div className={showBigWinModal ? "modal active" : "modal"}>
        <div className="modal-content" ref={modalRef}>
          <span className="close" onClick={doHideBigWinModal}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </span>
          <p>
            Voulez vous désigner le grand gagnant ?<br /> (Attention cette
            opération est irréversible)
          </p>
          <div className="buttons">
            <button
              className="btn"
              disabled={bigWinner ? true : false}
              onClick={handleBigWin}
            >
              Oui
            </button>
            <button
              className="btn cancel"
              disabled={bigWinner ? true : false}
              onClick={doHideBigWinModal}
            >
              Annuler
            </button>
          </div>
          <div
            className={bigWinnerError === "" ? "error-msg" : "error-msg active"}
          >
            <FontAwesomeIcon icon={faCircleXmark} /> : {bigWinnerError}
          </div>
          <div className={bigWinner ? "info-msg active" : "info-msg"}>
            <FontAwesomeIcon icon={faCircleUser} /> : Le grand gagnant est :{" "}
            {bigWinner?.name} (
            <a href={`mailto:${bigWinner?.email}`}>{bigWinner?.email}</a>)
          </div>
        </div>
      </div>

      <div className="main">
        <div className="content">
          <h2>Tableau de bord</h2>
          <h5>
            {`${user.name} (${user.email}) | `}
            <Link to="modifier">Modifier vos coordonnées</Link>
          </h5>
          <div className="card board">
            <div className="tools">
              <div className="buttons">
                <div className="d-grid gap-2">
                  <h1 style={{ color: "black" }}>Télécharger</h1>
                  <CSVLink
                    data={mailingList}
                    title={
                      mailingList.length === 0
                        ? "Aucun emails à télécharger"
                        : `Télécharger La liste des ${mailingList.length} emails`
                    }
                    onClick={() => {
                      if (mailingList.length === 0) return false;
                    }}
                    filename="TheTipTop-liste-emails-gagnants.csv"
                  >
                    <button
                      className="btn type-2"
                      disabled={mailingList.length === 0}
                    >
                      Liste emails des gagnants [{mailingList.length}]
                    </button>
                  </CSVLink>
                  <CSVLink
                    data={mailingListAll}
                    title={
                      mailingListAll.length === 0
                        ? "Aucun emails à télécharger"
                        : `Télécharger La liste des ${mailingListAll.length} emails`
                    }
                    onClick={() => {
                      if (mailingListAll.length === 0) return false;
                    }}
                    filename="TheTipTop-liste-emails-participants.csv"
                  >
                    <button
                      className="btn type-1"
                      disabled={mailingListAll.length === 0}
                    >
                      Liste emails des inscrits [{mailingListAll.length}]
                    </button>
                  </CSVLink>
                  <CSVLink
                    data={numbers}
                    filename="TheTipTop-liste-des-numéros-gagnants.csv"
                    onClick={() => {
                      if (numbers.length === 0) return false;
                    }}
                  >
                    <button
                      className="btn type-2"
                      disabled={numbers.length === 0}
                    >
                      Liste des numéros gagnants [{numbers.length - 1}]
                    </button>
                  </CSVLink>
                  <CSVLink
                    data={mailingListNews}
                    filename="TheTipTop-liste-des-emails-newsletter-gagnants.csv"
                    onClick={() => {
                      if (mailingListNews.length === 0) return false;
                    }}
                  >
                    <button
                      className="btn type-1"
                      disabled={mailingListNews.length === 0}
                    >
                      Liste des emails newsletter [{mailingListNews.length - 1}]
                    </button>
                  </CSVLink>
                </div>
              </div>
              <div className="chart">
                {chartOptions && (
                  <AgChartsReact options={chartOptions}></AgChartsReact>
                )}
              </div>
            </div>
            <div className="tools winner">
              <div className="buttons">
                {!bigWinner && (
                  <button className="btn" onClick={doShowBigWinModal}>
                    Désigner le grand gagnant
                  </button>
                )}
                <div className={bigWinner ? "warn-msg active" : "warn-msg"}>
                  <FontAwesomeIcon icon={faCircleUser} /> : Le grand gagnant est
                  : {bigWinner?.name} (
                  <a href={`mailto:${bigWinner?.email}`}>{bigWinner?.email}</a>)
                </div>
              </div>
            </div>
            <center>
              <h1>Liste des tickets gagnants</h1>
            </center>
            <p style={{ color: "red" }}>{error}</p>
            <input
              type="text"
              id="filter-input"
              className="input4"
              placeholder="Recherche avancée..."
              onInput={handleFilterChange}
            />
            <div className="ag-theme-material" style={{ height: 500 }}>
              <AgGridReact
                ref={gridRef}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
                pagination={true}
                rowData={row}
                paginationAutoPageSize={true}
              >
                <AgGridColumn headerName="Nom" field="Nom" />
                <AgGridColumn
                  headerName="Email"
                  field="Email"
                  cellRenderer={(params) => {
                    return (
                      <a href={`mailto:${params.value}`}>{params.value}</a>
                    );
                  }}
                />
                <AgGridColumn
                  headerName="Cadeau gagné"
                  field="Cadeau"
                  width={300}
                />
                <AgGridColumn headerName="Numéro de ticket" field="Numero" />
                <AgGridColumn headerName="Reçu" field="Received" />
                <AgGridColumn
                  headerName="Date de gain"
                  field="dateGain"
                  filter="agDateColumnFilter"
                  valueFormatter={(params) => {
                    return moment(params.value).format("DD/MM/yyyy");
                  }}
                />
              </AgGridReact>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Admin;
