select
  *
from
  m_users t
where
  t.user_id = :user_id
order by
  t.admin_flag desc
  , t.regist_date

