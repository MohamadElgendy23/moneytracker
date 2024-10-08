import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, [transactions]);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      });
    });
  }

  function deleteTransaction(id) {
    const url = process.env.REACT_APP_API_URL + `/transaction/delete/${id}`;
    fetch(url, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    }).then((response) => {
      response.json().then(() => {
        setTransactions((transactions) => {
          return transactions.filter((transaction) => transaction.id !== id);
        });
      });
    });
  }
  // calculate $ and ¢ for balance
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];
  return (
    <div className="wrapper">
      <main>
        <nav>
          <h1>Money Tracker</h1>
        </nav>
        <h4 color="gray">Total Balance</h4>
        <h2>
          ${balance}
          <span>{fraction}</span>
        </h2>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder={"+/- 200 new samsung tv"}
            ></input>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(ev) => setDatetime(ev.target.value)}
            ></input>
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder={"description"}
            ></input>
          </div>
          <button type="submit">Add new transaction</button>
          <div className="transactions">
            {transactions.length > 0 &&
              transactions.map((transaction) => (
                <div className="transaction">
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div
                      className={
                        "price " + (transaction.price < 0 ? "red" : "green")
                      }
                    >
                      {transaction.price}
                    </div>
                    <div className="datetime">{transaction.datetime}</div>
                    <div className="alter-actions-container">
                      <button
                        type="button"
                        onClick={() => deleteTransaction(transaction._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </form>
        <div className="transactions"></div>
      </main>
    </div>
  );
}

export default App;
