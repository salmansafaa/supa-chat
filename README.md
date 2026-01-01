## Student Details

Name: MUHAMMAD SALMAN AL FARISI BIN AB AZIZ

Student ID: 2024288464

Group: T5CDCS2703B

Lecturer: SIR MUHAMMAD ATIF RAMLAN

## project background

this project main goal is to create a real time chat application with Angular 20 library ecosystem and Supabase database. This project serve as practical implementation if backend service. it also cover :

- Authentication:
 Integrating Google OAuth 2.0 through Supabase Auth to provide a secure and seamless user onboarding experience.

- Database Architecture:
 Utilizing PostgreSQL on Supabase to manage user profiles and chat messages, enhanced by PostgreSQL Triggers and Functions to automate data synchronization.

- State Management:
 Leveraging Angular Signals and Reactive Forms to handle user input and real-time data updates efficiently.

- Security: 
Implementing Row Level Security (RLS) to ensure that users can only read or delete their own messages, protecting the integrity of the chat environment.

## Discussion
this project highlight efficency of backend development and a robust frontend framework. many of the logic part were make at database layer rather than application layer with Supabase PostGresSQl Trigger to ensure a syncronized data.

- Challanges:
Route Protection: One challenge involved securing the chat interface. We implemented an Angular CanActivate guard that checks the Supabase session state, ensuring unauthenticated users are redirected to the login page.

- Data Integrity: To prevent unauthorized message manipulation, we configured RLS policies. The solution involved writing SQL policies that verify the auth.uid() against the sender_id column in the chat table, effectively delegating security to the database.

- Outdated Tutorial : the Angular and Supabase used in tutorial are from a year ago. the change in angular version (use 17 in tutorial, current version is 24) and Supabase UI design create confusion.

Overall, the project show Angular service and signal give a better alternate to traditional lifecycle hooks involving state menangement. It also demonstrated Supabase as a good pratice for user authenticationa and data security.

<!-- ## Database Table Schema -->
## users table

* id (uuid)
* full_name (text)
* avatar_url (text)

## Creating a users table

```sql
CREATE TABLE public.users (
   id uuid not null references auth.users on delete cascade,
   full_name text NULL,
   avatar_url text NULL,
   primary key (id)
);
```

## Enable Row Level Security

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## Permit Users Access Their Profile

```sql
CREATE POLICY "Permit Users to Access Their Profile"
  ON public.users
  FOR SELECT
  USING ( auth.uid() = id );
```

## Permit Users to Update Their Profile

```sql
CREATE POLICY "Permit Users to Update Their Profile"
  ON public.users
  FOR UPDATE
  USING ( auth.uid() = id );
```

## Supabase Functions

```sql
CREATE
OR REPLACE FUNCTION public.user_profile() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.users (id, full_name,avatar_url)
VALUES
  (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name'::TEXT,
    NEW.raw_user_meta_data ->> 'avatar_url'::TEXT,
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Supabase Trigger

```sql
  CREATE TRIGGER
  create_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.user_profile();
```

## Chat_Messages table (Real Time)

* id (uuid)
* Created At (date)
* text (text)
* editable (boolean)
* sender (uuid)
