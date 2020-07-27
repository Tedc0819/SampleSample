# DEMO
## TODO
1. end-to-end testing from upload CSV to read records
## to start the system
1. docker-compose up
2. port mounted to 3000
## to run the test
1. yarn test
## enchancement
### sale record upload
1. Sale record CSV upload should create a record to indicate every upload
    1. this ensure those uplaoded CSV can be retry easily without re-upload via the API
2. Sale record CSV should be able to rerun without creating duplicated record
    1. every sale record should have an identifier which composes of
        1.CSV upload record id (mentioned in 1)
        2.purchase datetime
        3.user name
    2. records should then be upsert-ed
3. the CSV upload API should be enqueued and break down into multiple task to ensure it can be highly scale-able
    1. possible flow: api -> CSV upload record created -> enqueue and do API response -> dequeue -> estimate how many runs to split and how many runs should be handled parallelly by workers -> enqueue first batch of runs -> runs recursively enqueue their relative next run -> also markdown state of every run
    2. (the above flow is like what sl-express's runner service tho it's still not published to public)
    3. risk: number of file readstream on a file may be limited. need load test
