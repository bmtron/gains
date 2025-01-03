// import { convert_response_to } from "@/helpers/JsonConverter";
// import { Exercise } from "@/models/exerciseModels";
// import getAllItems from "../functions/getAllItems";
// import { SQLiteDatabase } from "expo-sqlite";

// // immediately deprecated this entire file. it shall remain.
// // as a testament to my stupidity of not planning anything out
// // or even attempting a modern solution to temporary persistent storage...
// // yikes, my guy

// const syncExerciseDataOutToServer = async (
//     db: SQLiteDatabase,
//     lastSyncDate: string
// ) => {
//     const exerciseResult = await db.runAsync(
//         "SELECT * FROM Exercise where dateupdated > ? or dateupdated IS NULL"
//     );
//     const exerciseModelMap = exerciseDataMapper(exerciseResult);

//     console.log(exerciseModelMap);
//     exerciseModelMap.forEach((item) => {
//         console.log(item.dateadded);
//         console.log(item.dateupdated);
//     });
// };
// const syncExerciseDataInToApp = async (
//     db: SQLiteDatabase,
//     lastSyncDate: string
// ) => {
//     const existingServerExercises = await getAllItems<Exercise[]>("/exercise");
//     const exerciseAppData = await db.getAllAsync("SELECT * FROM exercise;");
//     console.log(exerciseAppData);

//     const exerciseAppDataMap = exerciseDataMapper(exerciseAppData);

//     const exercisesToAddIn: Exercise[] = [];
//     const exercisesToUpdate: Exercise[] = [];

//     existingServerExercises.forEach((item) => {
//         if (
//             exerciseAppDataMap.find((e) => e.exerciseid === item.exerciseid) ===
//             undefined
//         ) {
//             exercisesToAddIn.push(item);
//         } else {
//             if (
//                 item.dateupdated === null ||
//                 item.dateupdated < getLocalDateTime(lastSyncDate)
//             ) {
//                 exercisesToUpdate.push(item);
//             }
//         }
//     });

//     //console.log(exercisesToAddIn);

//     //await db.runAsync("delete from exercise;");
//     console.log(exercisesToAddIn);
//     for (let i = 0; i < exercisesToAddIn.length; i++) {
//         console.log("adding item...");

//         const dateUpdatedTemp = exercisesToAddIn[i].dateupdated;
//         let dateUpdated = null;
//         if (dateUpdatedTemp !== null) {
//             dateUpdated = dateUpdatedTemp.toLocaleString();
//         }
//         const exerciseSetup = await db.runAsync(
//             "INSERT INTO exercise(exerciseid, musclegroupid, exercisename, notes, dateadded, dateupdated) VALUES (?, ?, ?, ?, ?, ?)",
//             exercisesToAddIn[i].exerciseid,
//             exercisesToAddIn[i].musclegroupid,
//             exercisesToAddIn[i].exercisename,
//             exercisesToAddIn[i].notes,
//             exercisesToAddIn[i].dateadded.toLocaleString(),
//             dateUpdated
//         );
//     }

//     const exerciseAppData2 = await db.getAllAsync("SELECT * FROM exercise;");

//     exercisesToUpdate.forEach(async (item) => {
//         const res = await db.runAsync(
//             "UPDATE exercise set musclegroupid = ?, exercisename = ?, notes = ?, dateadded = ?, dateupdated = ? " +
//                 "WHERE exerciseid = ?"
//         );
//     });
//     console.log("are we here yet?");
// };

// const exerciseDataMapper = (exerciseData: any): Exercise[] => {
//     const exerciseModelMap: Exercise[] = [];

//     exerciseData.map((item: any) => {
//         if (typeof item === "object" && item) {
//             const offsetMinutes = new Date(item.dateadded).getTimezoneOffset();

//             const ex: Exercise = {
//                 exerciseid: item.exerciseid,
//                 musclegroupid: item.musclegroupid,
//                 exercisename: item.exercisename,
//                 notes: item.notes,
//                 dateadded: getLocalDateTime(item.dateadded),
//                 dateupdated: item.dateupdated
//                     ? getLocalDateTime(item.dateupdated)
//                     : null,
//             };
//             exerciseModelMap.push(ex);
//         }
//     });
//     return exerciseModelMap;
// };
// const getLocalDateTime = (dateString: string): Date => {
//     const tempDate = new Date(dateString);
//     const offsetMinutes = tempDate.getTimezoneOffset();
//     return new Date(tempDate.getTime() - offsetMinutes * 60000);
// };

// const syncOutToServer = async (lastSyncDate: string) => {
//     const SQLite = await import("expo-sqlite");
//     const db = await SQLite.openDatabaseAsync("gains.db");

//     await syncExerciseDataOutToServer(db, lastSyncDate);
// };

// const syncInToApp = async (lastSyncDate: string) => {
//     const SQLite = await import("expo-sqlite");
//     const db = await SQLite.openDatabaseAsync("gains.db");
//     console.log("bassfdsafdsf");
//     await syncExerciseDataInToApp(db, lastSyncDate);
// };
// export { syncOutToServer, syncInToApp };
