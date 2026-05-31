import {useParams} from "react-router-dom";
import BackBtn from "../components/back-btn";
import {documentationData} from "../data/documentation_panel_data";

function DocumentationDetail() {
  const { commandId } = useParams();

  const doc = documentationData.find((item) => item.id === commandId);

  if (!doc) {
    return (
      <section className="documentation-page">
        <BackBtn />
        <h1 className="documentation-detail-title font-press-start">
          Documentation Not Found
        </h1>
      </section>
    );
  }

  return (
    <section className="documentation-page">
      <BackBtn />

      <h1 className="documentation-detail-title font-press-start">
        {doc.title}
      </h1>

      <img
        className="documentation-detail-image"
        src={doc.image}
        alt={doc.title}
      />
    </section>
  );
}

export default DocumentationDetail;