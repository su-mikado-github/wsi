select
  t.*
from
  m_layer3_division_values t
  inner join m_layer3_divisions t1 on (
    t1.division_id = t.division_id
    and t1.layer2_division_id = t.layer2_division_id
    and t1.layer3_division_id = t.layer3_division_id
  )
where
  t.delete_flag = 0
order by
  t1.sort_order
  , t.sort_order
