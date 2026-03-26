const CloseButton = ({handleState, customStyles, customText}) =>{
  return(
    <button
      onClick={handleState}
      style={customStyles}
    >
      {customText}
    </button>
  )
}

export default CloseButton;