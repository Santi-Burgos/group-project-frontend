const contextMenu = (listMap) =>{

  return(
    <div>
      <ul>
        {listMap.map((item)=>{
          <li key={item.name} onClick={item.handle}>
            <item.icon />
            {item.name}
          </li>
        })}
      </ul>
    </div>
  )
}