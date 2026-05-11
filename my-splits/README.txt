How to Reassemble the APK:
1. Download ALL these part files (app-debug.apk.part_aa, part_ab, ...) into the same folder.
2. Open a terminal in that folder.
3. Run the following command to combine them into the original APK:

cat app-debug.apk.part_* > app-reassembled.apk
