export const colors = {
  primary: "#50728E",
  secondary: "#dcd2ab",
  third: "#FCFCFE",
  fourth: "#50808E",
  white: "#fff",
  black: "#000",
  tint: "#222",
  almostWhite: "#DCDCDC",
  halfBlack: "#00000080",
  halfWhite: "#ffffff80",
};

{
  /* <FlatList
style={styles.cards}
data={docData.cards}
renderItem={({ item, index }) => (
  <Item
    card={item}
    index={index}
    markedCards={markedCards}
    setMarkedCards={setMarkedCards}
    url={urls[item]}
    originals={id > 99 ? false : true}
  />
)}
numColumns={2}
columnWrapperStyle={{ justifyContent: "space-evenly" }}
contentContainerStyle={{ paddingBottom: 90, paddingTop: 10 }}
keyExtractor={(index) => index.toString()}
/> */
}

{
  /* <FlatList
style={styles.cards}
data={orderCrads({
  docData: docData,
  markedCards: markedCards,
  setMarkedCards: setMarkedCards,
  urls: urls,
})}
renderItem={({ item }) => (item)}
numColumns={2}
columnWrapperStyle={{ justifyContent: "space-evenly" }}
contentContainerStyle={{ paddingBottom: 90, paddingTop: 5 }}
keyExtractor={(item, index) => index.toString()}
/> */
}
