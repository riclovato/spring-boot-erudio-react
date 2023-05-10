import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "../../services/api";

import "./styles.css";

import logoImage from "../../assets/logo.svg";
import { FiArrowLeft } from "react-icons/fi";

export default function NewBook() {
  const [id, setId] = useState(null);
  const [author, setAuthor] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");

  const { bookId } = useParams();

  const username = localStorage.getItem("username");
  const accessToken = localStorage.getItem("accessToken");

  async function loadBook() {
    try {
      const response = await api.get(`api/book/v1/${bookId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      let adjustedDate = response.data.launchDate.split("T", 10)[0];
      setId(response.data.id);
      setTitle(response.data.title);
      setAuthor(response.data.author);
      setPrice(response.data.price);
      setLaunchDate(adjustedDate);
    } catch (error) {
      alert("Error recovering book,Try again!");
      history.push("/books");
    }
  }

  useEffect(() => {
    if (bookId === "0") {
      return;
    } else {
      loadBook();
    }
  }, [bookId]);

  const history = useHistory();

  async function saveOrUpdate(e) {
    e.preventDefault();

    const data = {
      author,
      launchDate,
      price,
      title,
    };

    try {
      if (bookId === "0") {
        await api.post("api/book/v1", data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        data.id = id;
        await api.put("api/book/v1", data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      history.push("/books");
    } catch (error) {
      alert("Error creating book,Try again!");
    }
  }

  return (
    <div className="new-book-container">
      <div className="content">
        <section className="form">
          <img src={logoImage} alt="Erudio" />
          <h1>{bookId === "0" ? "Add New" : "Update"}</h1>
          <p>
            Enter the book information and click on{" "}
            {bookId === "0" ? "'Add'" : "'Update'"}
          </p>
          <Link className="black-link" to="/books">
            <FiArrowLeft size={16} color="#251fc5" />
            Back
          </Link>
        </section>
        <form onSubmit={saveOrUpdate}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="date"
            value={launchDate}
            onChange={(e) => setLaunchDate(e.target.value)}
          />
          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button className="button" type="submit">
            {bookId === "0" ? "Add" : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
