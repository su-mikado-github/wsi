select
  t.*
from
  m_users t
  inner join m_passwords s on (
    s.user_id = t.user_id
    and s.delete_flag = 0
    and s.password = :password
  )
where
  t.login_id = :login_id
  and t.delete_flag = 0
