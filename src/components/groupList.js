import QuitButton from './buttonQuitGroup.js';

const GroupList = ({ groups, onSelectGroup }) => {
  if (!groups || groups.length === 0) {
    return <h1>No hay grupos para mostrar</h1>;
  }

  return (
    <div>
      {groups.map((group) => (
        <div className='group-item' key={group.id_group}>
          <div
            className='list-group'
            onClick={() => onSelectGroup(group.id_group)}
          >
            <img
              className='img-listgroup'
              src={group.url_img}
              alt={'foto de ' + group.group_name}
            />
            <span className='group-name'>{group.group_name}</span>
          </div>
          <QuitButton groupID={group.id_group} />
        </div>
      ))}
    </div>
  );
};

export default GroupList;
