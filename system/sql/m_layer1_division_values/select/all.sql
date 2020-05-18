select
  t.*
  , t1.division_name
from
  m_layer1_division_values t
  inner join m_layer1_divisions t1 on (
    t1.division_id = t.division_id
  )
where
  t.delete_flag = 0
order by
  t1.sort_order
  , t.sort_order
