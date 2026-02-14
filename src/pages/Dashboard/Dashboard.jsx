import { useState } from "react";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

// hook
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const Dashboard = () => {
  const { user } = useAuthValue();
  const uid = user.uid;

  const { documents: posts, loading } = useFetchDocument("posts", null, uid);
  const { deleteDocument } = useDeleteDocument("posts");

  // estado do modal
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleDelete = (id) => {
    setPostToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deleteDocument(postToDelete);
    }
    setShowModal(false);
    setPostToDelete(null);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerêncie seus posts</p>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts!</p>
          <Link to="/posts/create" className="btn">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Título</span>
            <span>Ações</span>
          </div>
          {posts &&
            posts.map((post) => (
              <div key={post.id} className={styles.post_row}>
                <p>{post.title}</p>
                <div>
                  <Link to={`/posts/${post.id}`} className="btn btn_outline">
                    Ver
                  </Link>
                  <Link
                    to={`/posts/edit/${post.id}`}
                    className="btn btn_outline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn btn_outline btn_danger"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirmar exclusão</h3>
            <p>Você tem certeza que deseja excluir este post?</p>
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className="btn btn_danger">
                Sim, excluir
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn_outline"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
