import styles from "./EditPost.module.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { useFetchDocument } from "../../hooks/useFetchDocument";

const EditPost = () => {
  const { id } = useParams();
  const { document: post } = useFetchDocument("posts", id);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setImage(post.image);

      const textTags = post.tags.join(", ");
      setTags(textTags);
    }
  }, [post]);

  const { user } = useAuthValue();
  const { updateDocument, response } = useUpdateDocument("posts");

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

    const data = {
      title,
      image,
      body,
      tags: tagArray,
      uid: user.uid,
      createdBy: user.displayName,
    };

    updateDocument(id, data);

    // redirect to home page

    navigate("/dashboard");
  };

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h2>Editando post: {post.title}</h2>
          <p>Altere os dados do post como desejar</p>
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
            <p className={styles.preview_title}>Preview da imagem atual:</p>
            <img
              className={styles.image_preview}
              src={post.image}
              alt={post.title}
            />
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
            {!response.loading && <button className="btn">Editar</button>}
            {response.loading && (
              <button className="btn" disabled>
                Aguarde...
              </button>
            )}
            {response.error && <p className="error">{response.error}</p>}
            {formError && <p className="error">{formError}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default EditPost;
