import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    const [links, setLinks] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editUrl, setEditUrl] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must login first!");
            navigate("/login");
        } else {
            fetchLinks(token);
        }
    }, [navigate]);

    const fetchLinks = async (token) => {
        try {
            const res = await fetch("http://localhost:5000/api/links", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setLinks(data);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/links", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            if (res.ok) {
                setLinks([...links, data]);
                setUrl("");
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLink = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/links/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setLinks(links.filter((link) => link._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditLink = (id, currentUrl) => {
        setEditId(id);
        setEditUrl(currentUrl);
    };

    const handleUpdateLink = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/links/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ url: editUrl }),
            });

            const data = await res.json();
            if (res.ok) {
                setLinks(links.map((link) => (link._id === id ? data : link)));
                setEditId(null);
                setEditUrl("");
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h2>Welcome to LinkSaver 🚀</h2>

            <form onSubmit={handleAddLink}>
                <input
                    type="url"
                    placeholder="Enter a link"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit">Save Link</button>
            </form>

            <h3>Saved Links</h3>
            <ul>
                {links.map((link) => (
                    <li key={link._id}>
                        {editId === link._id ? (
                            <>
                                <input
                                    type="url"
                                    value={editUrl}
                                    onChange={(e) => setEditUrl(e.target.value)}
                                />
                                <button onClick={() => handleUpdateLink(link._id)}>Save</button>
                                <button onClick={() => setEditId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <a href={link.url} target="_blank" rel="noreferrer">
                                    {link.url}
                                </a>
                                <button
                                    onClick={() => handleEditLink(link._id, link.url)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteLink(link._id)}
                                    style={{ marginLeft: "10px", color: "red" }}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default HomePage;
