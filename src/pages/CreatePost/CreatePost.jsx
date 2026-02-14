import styles from "./CreatePost.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("posts");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // validate image url
    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ter uma URL valida.");
    }

    // create the tag array
    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim().toLocaleLowerCase());

    // check all values
    if (!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos.");
    }

    if (formError) return;

    insertDocument({
      title,
      image,
      body,
      tags: tagArray,
      uid: user.uid,
      createdBy: user.displayName,
    });

    // redirect to home page

    navigate("/");
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Titulo:
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Pense num bom titulo..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label htmlFor="urlImage">
          URL da imagem:
          <input
            type="text"
            id="urlImage"
            name="image"
            required
            placeholder="Insira uma imagem que represente seu post"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>
        <label htmlFor="body">
          Conteudo:
          <textarea
            name="body"
            required
            id="body"
            placeholder="Insira a descrição do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>
        <label htmlFor="tags">
          Tags:
          <input
            type="text"
            id="tags"
            required
            placeholder="Insira as tags separado por virgulas"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>
        {console.log("Loading?", response.loading)}
        {!response.loading && <button className="btn">Cadastrar</button>}
        {response.loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {response.error && <p className="error">{response.error}</p>}
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
