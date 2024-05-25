import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { colors } from "../constants/color";
import { database, filterMenuItems, selectAllMenu } from "../database";
import HeroSection from "../components/Hero";
import debounce from "../utils/debounce";

export default function HomeScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filterCategories, setFilterCategories] = useState([]);

  const loadMenu = async () => {
    try {
      const menuItems = await selectAllMenu(database);
      setMenuItems(menuItems);
      const categories = [
        ...new Set(menuItems.map((item) => capitalize(item.category))),
      ];
      setFilterCategories(categories);
    } catch (err) {
      console.error(`Error selecting all menu items: ${err}`);
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    loadMenu();
  }, []);

  const onFilterClick = (item) => {
    setActiveFilters((prevFilters) =>
      prevFilters.includes(item)
        ? prevFilters.filter((filter) => filter !== item)
        : [...prevFilters, item]
    );
  };

  const filterMenu = () => {
    try {
      debounce(
        filterMenuItems(database, activeFilters, searchInput).then(
          setMenuItems
        ),
        500
      );
    } catch (_) {}
  };

  useEffect(() => {
    filterMenu();
  }, [searchInput, activeFilters]);

  return (
    <View style={styles.homeContainer}>
      <HeroSection setSearchInput={setSearchInput} />
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>ORDER FOR DELIVERY!</Text>
        <ScrollView style={styles.filterScrollView} horizontal>
          {filterCategories.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.filterButton,
                {
                  backgroundColor: activeFilters.includes(item)
                    ? colors.GREEN
                    : colors.GRAY,
                },
              ]}
              onPress={() => onFilterClick(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: activeFilters.includes(item)
                      ? colors.GRAY
                      : colors.GREEN,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <View style={styles.menuDetails}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
          </View>
        )}
        keyExtractor={(item, index) => item.name + index}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  filtersContainer: {
    padding: 20,
    borderBottomColor: colors.BLACK,
  },
  filterTitle: {
    fontWeight: "900",
  },
  filterScrollView: {
    marginTop: 20,
  },
  filterButton: {
    borderRadius: 10,
    marginRight: 12,
    padding: 10,
  },
  filterButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  menuItem: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuDetails: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: "bold",
  },
  itemDescription: {
    color: colors.BLACK,
    fontWeight: "500",
  },
  itemPrice: {
    fontWeight: "500",
  },
  menuImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  itemSeparator: {
    height: 0.5,
    width: "90%",
    backgroundColor: "grey",
    alignSelf: "center",
  },
});
