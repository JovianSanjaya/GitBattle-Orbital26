import { useParams } from "react-router-dom";
import BackBtn from "../components/back-btn";
import type { DocumentationItem } from "../data/documentation_panel_data";
import { documentationData } from "../data/documentation_panel_data";
import type { ReactElement } from "react";

function DocumentationDetail(): ReactElement {
  const { commandId } = useParams<{ commandId: string }>();

  const doc = documentationData.find((item: DocumentationItem) => item.id === commandId);

  if (!doc) {
    return (
      <section className="documentation-page documentation-panel-details">
        <BackBtn />
        <h1 className="documentation-detail-title font-press-start">
          Documentation Not Found
        </h1>
      </section>
    );
  }

  return (
    <section className="documentation-page documentation-panel-details">
      <BackBtn />

      <h1 className="documentation-detail-title font-press-start">
        {doc.title}
      </h1>

      <div className="documentation-info-box documentation-detail-box font-press-start">
        <h2>WHAT IT DOES</h2>
        <p>{doc.whatItDoes}</p>

        <h2>WHAT CHANGES IN THE GRAPH</h2>
        {doc.graphChanges.map((change: string) => (
          <p key={change}>{change}</p>
        ))}

        <h2>BEFORE → AFTER</h2>

        <img
          className="documentation-graph-image"
          src={doc.image}
          alt={`${doc.title} graph`}
        />
      </div>
    </section>
  );
}

export default DocumentationDetail;