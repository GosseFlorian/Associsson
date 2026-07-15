export function Organisation() {
  return (
    <>
    <header className="organisation">
      <span>/organisation</span>
    </header>
    <main>
      
      <section>
        <button/>
        <button/>
        <button/>
      </section>
      
      <section>
        <div>
          <div>
            <div>
              <h1></h1>
              <p></p>
            </div>
            <button/>
          </div>
          <hr/>
          <div>
            <p></p>
            <button/>
          </div>
        </div>
        <div>
          <div>
            <div>
            <h1></h1>
            <p></p>
            </div>
            <button/>
          </div>
          <hr/>
          <div>
            <div>
              <OrganisationCard/>
            </div>
          </div>  
        </div>
      </section>
    </main>
    </>
  );
}

export function OrganisationCard({ label = "ORGA1" }: { label?: string }) {
  return (
    <div className="orga-card">
      <span className="orga-card__eyebrow">ORGANISATION</span>
      <p className="orga-card__label">{label}</p>
    </div>
  );
}