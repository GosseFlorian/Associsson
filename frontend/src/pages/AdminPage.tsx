import '../style/pages/AdminPage.css';
import { useLoginStore } from '../stores/loginStore';
import { useState } from 'react';
import { Button } from '../components/Button';
import { ProjetCard } from '../components/ProjetCard';
import { ProfilCard } from '../components/ProfilCard';
import { TacheCard } from '../components/TacheCard';
import { VueAll } from '../components/VueAll';
import { MembreList } from '../components/MembreList';

export function AdminPage() {
  const [sectionActive, setSectionActive] = useState('projets');

  const role = useLoginStore((state) => state.role);

  if (role !== 'admin') {
    return <p>Vous n'avez pas le role requis</p>;
  }
  return (
    <section className="benevole">
      <div className="benevole-selection">
        <Button
          text="Mon profil"
          action={() => setSectionActive('profil')}
          active={sectionActive === 'profil'}
        />
        <Button
          text="Vue d'ensemble"
          action={() => setSectionActive('vueAll')}
          active={sectionActive === 'vueAll'}
        />
        <Button
          text="Membres"
          action={() => setSectionActive('membre')}
          active={sectionActive === 'membre'}
        />
        <Button
          text="Projets"
          action={() => setSectionActive('projets')}
          active={sectionActive === 'projets'}
        />
        <Button
          text="Tâches"
          action={() => setSectionActive('taches')}
          active={sectionActive === 'taches'}
        />
      </div>
      <div>
        {sectionActive === 'profil' && (
          <div className="benevole-profil">
            <ProfilCard />
          </div>
        )}
        {sectionActive === 'vueAll' && (
          <div className="benevole-vueAll">
            <VueAll />
          </div>
        )}
        {sectionActive === 'membre' && (
          <div className="benevole-membre">
            <MembreList />
          </div>
        )}
        {sectionActive === 'projets' && (
          <div className="benevole-projet">
            <ProjetCard />
          </div>
        )}
        {sectionActive === 'taches' && (
          <div className="benevole-tache">
            <TacheCard />
          </div>
        )}
      </div>
    </section>
  );
}
