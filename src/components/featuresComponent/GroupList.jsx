import React, { useEffect, useState } from "react";
import Card from "../Card";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import People from "../People";
const GroupList = () => {
  const db = getDatabase();
  const currentUser = useSelector((state) => state.userLoginInfo.userLoginInfo);
  const groupRef = ref(db, "groups/");
  const groupRequestRef = ref(db, "groupRequest/");
  const [groups, setgroups] = useState([]);
  const [groupRequests, setGroupRequests] = useState([]);
  useEffect(() => {
    onValue(groupRef, (snapshot) => {
      let groups = [];
      snapshot.forEach((group) => {
        if (group.val().adminId !== currentUser.uid) {
          groups.push({
            key: group.key,
            value: group.val(),
          });
        }
      });
      setgroups(groups);
    });
    onValue(groupRequestRef, (snapshot) => {
      let groupRequests = [];
      snapshot.forEach((groupRequest) => {
        groupRequests.push(
          groupRequest.val().gKey + groupRequest.val().groupReqId
        );
      });
      setGroupRequests(groupRequests);
    });
  }, []);
  const handleGroupRequest = (group) => {
    set(push(ref(db, "groupRequest/")), {
      gKey: group.key,
      adminId: group.value.adminId,
      groupReqId: currentUser.uid,
      groupReqName: currentUser.displayName,
      groupReqPic: currentUser.photoURL,
    });
  };
  return (
    <Card messageShow={true} title={"group list"}>
      {groups?.map((group) => (
        <People
          key={group.key}
          name={group.value.groupName}
          messageShow={true}
          message={`admin name: ${group.value.adminName}`}
        >
          {groupRequests.includes(group.key + currentUser.uid) ? (
            <button
              className="px-8 py-3 ml-auto text-white bg-red-600 rounded-lg"
              // onClick={() => handleGroupRequest(group)}
            >
              pending
            </button>
          ) : (
            <button
              className="px-8 py-3 ml-auto text-white bg-blue-600 rounded-lg"
              onClick={() => handleGroupRequest(group)}
            >
              join
            </button>
          )}
        </People>
      ))}
    </Card>
  );
};

export default GroupList;
