# Backend:
- Allow categories of each main entity to be deleted without cascading issues
- Allow main entities to be deleted without cascading the nested relations

# Frontend:
- See which deletes, adds and edits work on each page
- May be use the events to emit the previously edited and deleted entity together with the new one so that graphs and accounts can be edited without having to refetch everything
**We already have the previous dao because we have selected it when editing or deleting it! The user can't delete or edit a DAO that hasn't been fully fetched!**