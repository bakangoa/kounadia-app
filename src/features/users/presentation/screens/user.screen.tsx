import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useUser } from "../hooks/user.hooks";
import "../redux";

const UserMain = (props: {
  fetchUser: () => void
}) => {
  const { user, loading } = useUser();

  useEffect(() => {
    props.fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>No user loaded.</Text>;

  return (
    <>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
    </>
  );
};

export const UserScreen = () => {
  const { fetch } = useUser();

  const fetchUser = () => {
    fetch("1");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <UserMain fetchUser={fetchUser} />
      <Button title="Load user" onPress={() => { fetchUser(); }} />
    </View>
  );
};