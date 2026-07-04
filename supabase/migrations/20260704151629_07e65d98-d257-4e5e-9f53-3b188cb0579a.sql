
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  due_date DATE,
  lmp_date DATE,
  baby_type TEXT NOT NULL DEFAULT 'single' CHECK (baby_type IN ('single','twins')),
  height_cm NUMERIC,
  weight_kg NUMERIC,
  avatar_url TEXT,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Daily logs
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  water_glasses INT NOT NULL DEFAULT 0,
  sleep_hours NUMERIC NOT NULL DEFAULT 0,
  meals_completed INT NOT NULL DEFAULT 0,
  exercise_minutes INT NOT NULL DEFAULT 0,
  mood TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_logs TO authenticated;
GRANT ALL ON public.daily_logs TO service_role;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own daily_logs" ON public.daily_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Symptoms
CREATE TABLE public.symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'mild' CHECK (severity IN ('mild','moderate','severe')),
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.symptoms TO authenticated;
GRANT ALL ON public.symptoms TO service_role;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own symptoms" ON public.symptoms FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Kick sessions
CREATE TABLE public.kick_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kicks INT NOT NULL DEFAULT 0,
  duration_seconds INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kick_sessions TO authenticated;
GRANT ALL ON public.kick_sessions TO service_role;
ALTER TABLE public.kick_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own kick_sessions" ON public.kick_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Contractions
CREATE TABLE public.contractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds INT NOT NULL,
  interval_seconds INT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contractions TO authenticated;
GRANT ALL ON public.contractions TO service_role;
ALTER TABLE public.contractions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own contractions" ON public.contractions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Medicines
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  time_of_day TEXT NOT NULL DEFAULT '08:00',
  frequency TEXT NOT NULL DEFAULT 'daily',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medicines TO authenticated;
GRANT ALL ON public.medicines TO service_role;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own medicines" ON public.medicines FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  doctor TEXT,
  location TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI messages
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ai_messages" ON public.ai_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reminder settings
CREATE TABLE public.reminder_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  water_enabled BOOLEAN NOT NULL DEFAULT true,
  medicine_enabled BOOLEAN NOT NULL DEFAULT true,
  workout_enabled BOOLEAN NOT NULL DEFAULT false,
  prenatal_vitamin_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminder_settings TO authenticated;
GRANT ALL ON public.reminder_settings TO service_role;
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reminder_settings" ON public.reminder_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.reminder_settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
